<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Question;
use App\Models\ScoringRule;
use App\Models\SpecialistProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssessmentController extends Controller
{
    public function index(): Response
    {
        $questions = Question::where('is_active', true)
            ->orderBy('order_index')
            ->get();

        return Inertia::render('Assessment/Index', [
            'questions' => $questions,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $questions = Question::where('is_active', true)
            ->orderBy('order_index')
            ->get();

        $request->validate([
            'answers' => 'required|array|size:'.$questions->count(),
            'answers.*' => 'required|integer|min:0|max:3',
        ]);

        $answers = $request->input('answers');
        $moodScore = 0;
        $anxietyScore = 0;
        $burnoutScore = 0;

        foreach ($questions as $question) {
            $val = (int) ($answers[$question->id] ?? 0);
            if ($question->category === 'mood') {
                $moodScore += $val;
            } elseif ($question->category === 'anxiety') {
                $anxietyScore += $val;
            } else {
                $burnoutScore += $val;
            }
        }

        $totalScore = $moodScore + $anxietyScore + $burnoutScore;

        // Dynamic Scoring Rules lookup from DB
        $matchedRule = ScoringRule::where('min_score', '<=', $totalScore)
            ->where('max_score', '>=', $totalScore)
            ->first();

        if ($matchedRule) {
            $severity = $matchedRule->level;
            $recommendation = $matchedRule->recommendation;
        } elseif ($totalScore <= 14) {
            $severity = 'low';
            $recommendation = 'حالتك النفسية تبدو مستقرة ضمن النطاق الطبيعي.';
        } elseif ($totalScore <= 28) {
            $severity = 'moderate';
            $recommendation = 'تشير إجاباتك إلى وجود مؤشرات متوسطة للضغوط النفسية.';
        } else {
            $severity = 'high';
            $recommendation = 'تشير إجاباتك إلى ارتفاع ملحوظ في مستويات الضغط أو القلق. نوصيك بالتواصل مع مختص.';
        }

        $assessment = Assessment::create([
            'user_id' => $request->user()?->id,
            'total_score' => $totalScore,
            'mood_score' => $moodScore,
            'anxiety_score' => $anxietyScore,
            'burnout_score' => $burnoutScore,
            'severity_level' => $severity,
            'recommendation' => $recommendation,
            'answers' => $answers,
        ]);

        session(['last_assessment_id' => $assessment->id]);

        return redirect()->route('assessment.result', ['assessment' => $assessment->id]);
    }

    public function result(Request $request, ?Assessment $assessment = null): Response|RedirectResponse
    {
        if (! $assessment) {
            $lastId = session('last_assessment_id');
            if ($lastId) {
                $assessment = Assessment::find($lastId);
            }
        }

        if (! $assessment) {
            return redirect()->route('assessment.index');
        }

        // Enforce privacy: only owner, admin, or current guest session can view
        $user = $request->user();
        $isOwner = $user && $assessment->user_id === $user->id;
        $isAdmin = $user && $user->role === 'admin';
        $isCurrentSession = session('last_assessment_id') === $assessment->id;

        if (! $isOwner && ! $isAdmin && ! $isCurrentSession) {
            abort(403, 'عذراً، لا تملك صلاحية الاطلاع على نتائج هذا التقييم.');
        }

        $specialists = SpecialistProfile::with('user:id,name')
            ->where('is_approved', true)
            ->take(3)
            ->get();

        return Inertia::render('Assessment/Result', [
            'assessment' => $assessment,
            'specialists' => $specialists,
        ]);
    }
}
