<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\SpecialistProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SpecialistDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $profile = $user->specialistProfile ?? SpecialistProfile::create([
            'user_id' => $user->id,
            'title' => 'أخصائي نفسي',
            'specialty' => 'الاستشارات النفسية',
            'experience_years' => 1,
            'bio' => '',
            'contact_phone' => $user->phone ?? '',
            'is_approved' => false,
        ]);

        $articles = $user->articles()->latest()->get();
        $consultationRequests = $profile->consultationRequests()
            ->with('assessment:id,total_score,severity_level')
            ->latest()
            ->get()
            ->map(function ($req) {
                if (! $req->share_assessment) {
                    $req->setRelation('assessment', null);
                }

                return $req;
            });

        return Inertia::render('Specialist/Dashboard', [
            'specialistProfile' => $profile,
            'articles' => $articles,
            'consultationRequests' => $consultationRequests,
        ]);
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'specialty' => 'required|string|max:255',
            'experience_years' => 'required|integer|min:0|max:60',
            'bio' => 'required|string|max:1500',
            'certificates' => 'nullable|string|max:1000',
            'contact_phone' => 'required|string|max:30',
        ]);

        $request->user()->specialistProfile()->updateOrCreate(
            ['user_id' => $request->user()->id],
            $validated
        );

        return back()->with('success', 'تم تحديث ملفك المهني بنجاح.');
    }

    public function storeArticle(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'summary' => 'required|string|max:500',
            'content' => 'required|string',
            'reading_time' => 'required|integer|min:1|max:30',
        ]);

        Article::create([
            'author_id' => $request->user()->id,
            ...$validated,
            'status' => 'pending',
        ]);

        return back()->with('success', 'تم إرسال المقال للمراجعة من قِبل الإدارة قبل النشر.');
    }
}
