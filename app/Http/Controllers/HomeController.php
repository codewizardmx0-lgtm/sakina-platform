<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Question;
use App\Models\SpecialistProfile;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $articles = Article::with('author:id,name')
            ->where('status', 'approved')
            ->latest('published_at')
            ->take(4)
            ->get();

        $specialists = SpecialistProfile::with('user:id,name,email')
            ->where('is_approved', true)
            ->take(4)
            ->get();

        return Inertia::render('Home', [
            'articles' => $articles,
            'specialists' => $specialists,
            'questionsCount' => Question::where('is_active', true)->count(),
        ]);
    }

    public function articles(): Response
    {
        $articles = Article::with('author:id,name')
            ->where('status', 'approved')
            ->latest('published_at')
            ->get();

        return Inertia::render('Articles/Index', [
            'articles' => $articles,
        ]);
    }
}
