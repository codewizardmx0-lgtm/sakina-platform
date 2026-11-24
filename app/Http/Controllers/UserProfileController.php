<?php

namespace App\Http\Controllers;

use App\Models\MoodLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $assessments = $user->assessments()->latest()->get();
        $consultationRequests = $user->consultationRequests()
            ->with('specialistProfile.user:id,name')
            ->latest()
            ->get();
        $moodLogs = $user->moodLogs()->latest()->take(10)->get();

        $chartData = $user->assessments()
            ->oldest()
            ->get(['id', 'total_score', 'mood_score', 'anxiety_score', 'burnout_score', 'created_at'])
            ->map(fn ($item) => [
                'date' => $item->created_at->format('m/d'),
                'total' => $item->total_score,
                'mood' => $item->mood_score,
                'anxiety' => $item->anxiety_score,
                'burnout' => $item->burnout_score,
            ]);

        return Inertia::render('User/Profile', [
            'assessments' => $assessments,
            'consultationRequests' => $consultationRequests,
            'moodLogs' => $moodLogs,
            'chartData' => $chartData,
        ]);
    }

    public function storeMood(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'mood' => 'required|in:happy,calm,anxious,sad,exhausted',
            'note' => 'nullable|string|max:500',
        ]);

        MoodLog::create([
            'user_id' => $request->user()->id,
            ...$validated,
        ]);

        return back()->with('success', 'تم حفظ حالتك المزاجية في مفكرتك الخاصة.');
    }
}
