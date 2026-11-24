<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Assessment;
use App\Models\ConsultationRequest;
use App\Models\Question;
use App\Models\ScoringRule;
use App\Models\SpecialistProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_users' => User::where('role', 'beneficiary')->count(),
            'total_specialists' => SpecialistProfile::where('is_approved', true)->count(),
            'pending_specialists' => SpecialistProfile::where('is_approved', false)->count(),
            'approved_articles' => Article::where('status', 'approved')->count(),
            'pending_articles' => Article::where('status', 'pending')->count(),
            'total_assessments' => Assessment::count(),
            'high_severity_assessments' => Assessment::where('severity_level', 'high')->count(),
            'total_consultations' => ConsultationRequest::count(),
            'pending_consultations' => ConsultationRequest::where('status', 'pending')->count(),
        ];

        $chartData = [
            'severity' => [
                'low' => Assessment::where('severity_level', 'low')->count(),
                'moderate' => Assessment::where('severity_level', 'moderate')->count(),
                'high' => Assessment::where('severity_level', 'high')->count(),
            ],
            'axes_avg' => [
                'mood' => round((float) Assessment::avg('mood_score'), 1),
                'anxiety' => round((float) Assessment::avg('anxiety_score'), 1),
                'burnout' => round((float) Assessment::avg('burnout_score'), 1),
            ],
        ];

        $users = User::latest()->get(['id', 'name', 'email', 'role', 'phone', 'is_active', 'created_at']);
        $specialists = SpecialistProfile::with('user:id,name,email,is_active')->latest()->get();
        $articles = Article::with('author:id,name')->latest()->get();
        $questions = Question::orderBy('order_index')->get();
        $consultations = ConsultationRequest::with('specialistProfile.user:id,name')->latest()->get();
        $scoringRules = ScoringRule::orderBy('min_score')->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'chartData' => $chartData,
            'users' => $users,
            'specialists' => $specialists,
            'articles' => $articles,
            'questions' => $questions,
            'consultations' => $consultations,
            'scoringRules' => $scoringRules,
        ]);
    }

    public function toggleUser(User $user): RedirectResponse
    {
        if ($user->role === 'admin') {
            return back()->with('error', 'لا يمكن تعطيل حساب الإدارة.');
        }

        $user->update(['is_active' => ! $user->is_active]);

        return back()->with('success', 'تم تحديث حالة المستخدم.');
    }

    public function destroyUser(User $user): RedirectResponse
    {
        if ($user->role === 'admin') {
            return back()->with('error', 'لا يمكن حذف حساب الإدارة.');
        }

        $user->delete();

        return back()->with('success', 'تم حذف حساب المستخدم بنجاح.');
    }

    public function storeSpecialist(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'title' => 'required|string|max:100',
            'specialty' => 'required|string|max:255',
            'experience_years' => 'required|integer|min:0|max:60',
            'contact_phone' => 'required|string|max:30',
            'bio' => 'required|string|max:1500',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'specialist',
            'phone' => $validated['contact_phone'],
            'is_active' => true,
        ]);

        SpecialistProfile::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'specialty' => $validated['specialty'],
            'experience_years' => $validated['experience_years'],
            'contact_phone' => $validated['contact_phone'],
            'bio' => $validated['bio'],
            'is_approved' => true,
        ]);

        return back()->with('success', 'تمت إضافة المستشار واعتماده في الدليل بنجاح.');
    }

    public function updateSpecialist(Request $request, SpecialistProfile $specialist): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'title' => 'required|string|max:100',
            'specialty' => 'required|string|max:255',
            'experience_years' => 'required|integer|min:0|max:60',
            'contact_phone' => 'required|string|max:30',
            'bio' => 'required|string|max:1500',
        ]);

        $specialist->user?->update(['name' => $validated['name'], 'phone' => $validated['contact_phone']]);
        $specialist->update([
            'title' => $validated['title'],
            'specialty' => $validated['specialty'],
            'experience_years' => $validated['experience_years'],
            'contact_phone' => $validated['contact_phone'],
            'bio' => $validated['bio'],
        ]);

        return back()->with('success', 'تم تحديث بيانات المستشار بنجاح.');
    }

    public function destroySpecialist(SpecialistProfile $specialist): RedirectResponse
    {
        $user = $specialist->user;
        $specialist->delete();
        if ($user && $user->role === 'specialist') {
            $user->delete();
        }

        return back()->with('success', 'تم حذف المستشار من النظام.');
    }

    public function approveSpecialist(SpecialistProfile $specialist): RedirectResponse
    {
        $specialist->update(['is_approved' => true]);

        return back()->with('success', 'تم اعتماد المستشار وإظهاره في الدليل.');
    }

    public function rejectSpecialist(SpecialistProfile $specialist): RedirectResponse
    {
        $specialist->update(['is_approved' => false]);

        return back()->with('success', 'تم إيقاف ظهور المستشار في الدليل.');
    }

    public function approveArticle(Article $article): RedirectResponse
    {
        $article->update([
            'status' => 'approved',
            'published_at' => now(),
        ]);

        return back()->with('success', 'تم اعتماد ونشر المقال التوعوي.');
    }

    public function rejectArticle(Article $article): RedirectResponse
    {
        $article->update(['status' => 'rejected']);

        return back()->with('success', 'تم رفض المقال.');
    }

    public function storeQuestion(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category' => 'required|in:mood,anxiety,burnout',
            'question_text' => 'required|string|max:500',
        ]);

        $labels = [
            'mood' => 'المزاج والاكتئاب',
            'anxiety' => 'التوتر والقلق',
            'burnout' => 'الضغوط والاحتراق',
        ];

        $nextOrder = (Question::max('order_index') ?? 0) + 1;

        Question::create([
            'category' => $validated['category'],
            'category_label' => $labels[$validated['category']],
            'question_text' => $validated['question_text'],
            'order_index' => $nextOrder,
            'is_active' => true,
        ]);

        return back()->with('success', 'تمت إضافة السؤال بنجاح.');
    }

    public function updateQuestion(Request $request, Question $question): RedirectResponse
    {
        $validated = $request->validate([
            'category' => 'required|in:mood,anxiety,burnout',
            'question_text' => 'required|string|max:500',
        ]);

        $labels = [
            'mood' => 'المزاج والاكتئاب',
            'anxiety' => 'التوتر والقلق',
            'burnout' => 'الضغوط والاحتراق',
        ];

        $question->update([
            'category' => $validated['category'],
            'category_label' => $labels[$validated['category']],
            'question_text' => $validated['question_text'],
        ]);

        return back()->with('success', 'تم تعديل السؤال بنجاح.');
    }

    public function toggleQuestion(Question $question): RedirectResponse
    {
        $question->update(['is_active' => ! $question->is_active]);

        return back()->with('success', 'تم تحديث حالة السؤال.');
    }

    public function destroyQuestion(Question $question): RedirectResponse
    {
        $question->delete();

        return back()->with('success', 'تم حذف السؤال.');
    }

    public function updateScoringRule(Request $request, ScoringRule $scoringRule): RedirectResponse
    {
        $validated = $request->validate([
            'label' => 'required|string|max:120',
            'min_score' => 'required|integer|min:0|max:100',
            'max_score' => 'required|integer|min:0|max:100',
            'recommendation' => 'required|string|max:1500',
        ]);

        $scoringRule->update($validated);

        return back()->with('success', 'تم تحديث قاعدة احتساب الدرجات بنجاح.');
    }

    public function exportAssessmentsCsv(): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="sakina-assessments-stats.csv"',
        ];

        $assessments = Assessment::latest()->get([
            'id',
            'total_score',
            'mood_score',
            'anxiety_score',
            'burnout_score',
            'severity_level',
            'created_at',
        ]);

        return response()->stream(function () use ($assessments) {
            $out = fopen('php://output', 'w');
            // UTF-8 BOM for Arabic Excel compatibility
            fwrite($out, "\xEF\xBB\xBF");
            fputcsv($out, ['المعرف', 'الدرجة الكلية', 'المزاج والاكتئاب', 'التوتر والقلق', 'الضغوط والاحتراق', 'المستوى', 'التاريخ']);

            foreach ($assessments as $row) {
                fputcsv($out, [
                    $row->id,
                    $row->total_score,
                    $row->mood_score,
                    $row->anxiety_score,
                    $row->burnout_score,
                    $row->severity_level,
                    $row->created_at->format('Y-m-d H:i'),
                ]);
            }

            fclose($out);
        }, 200, $headers);
    }
}
