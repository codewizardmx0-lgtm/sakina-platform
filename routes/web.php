<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\ConsultationRequestController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SpecialistDashboardController;
use App\Http\Controllers\SpecialistDirectoryController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 1. بوابة المستفيدين والزوار (Public & Beneficiary Portal)
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/home', [HomeController::class, 'index']);
Route::get('/articles', [HomeController::class, 'articles'])->name('articles.index');

// 2. مقياس التقييم النفسي الأولي ونتائجه
Route::get('/assessment', [AssessmentController::class, 'index'])->name('assessment.index');
Route::post('/assessment', [AssessmentController::class, 'store'])->name('assessment.store');
Route::get('/assessment/result/{assessment?}', [AssessmentController::class, 'result'])->name('assessment.result');

// 3. دليل المستشارين وطلبات التواصل الأولي
Route::get('/specialists-directory', [SpecialistDirectoryController::class, 'index'])->name('specialists.directory');
Route::post('/consultations', [ConsultationRequestController::class, 'store'])->name('consultations.store');
Route::patch('/consultations/{consultationRequest}/status', [ConsultationRequestController::class, 'updateStatus'])
    ->middleware(['auth'])
    ->name('consultations.status');

// توجيه ذكي للوحة التحكم حسب الدور
Route::get('/dashboard', function () {
    $user = auth()->user();
    if ($user->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }
    if ($user->role === 'specialist') {
        return redirect()->route('specialist.dashboard');
    }

    return redirect()->route('user.profile');
})->middleware(['auth'])->name('dashboard');

// 4. الملف الشخصي للمستفيد وسجل تقييماته ومفكرة المزاج
Route::middleware(['auth'])->group(function () {
    Route::get('/user/profile', [UserProfileController::class, 'index'])->name('user.profile');
    Route::post('/user/moods', [UserProfileController::class, 'storeMood'])->name('user.moods.store');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// 5. بوابة المستشار النفسي المنفصلة (Dedicated Specialist Portal)
Route::get('/specialist/login', function () {
    if (auth()->check() && auth()->user()->role === 'specialist') {
        return redirect()->route('specialist.dashboard');
    }

    return Inertia::render('Specialist/Login');
})->name('specialist.login');

Route::middleware(['auth', 'role:specialist,admin'])->prefix('specialist')->name('specialist.')->group(function () {
    Route::get('/dashboard', [SpecialistDashboardController::class, 'index'])->name('dashboard');
    Route::post('/profile', [SpecialistDashboardController::class, 'updateProfile'])->name('profile.update');
    Route::post('/articles', [SpecialistDashboardController::class, 'storeArticle'])->name('articles.store');
});

// 6. بوابة الإدارة المنفصلة (Dedicated Admin Portal /Admin)
Route::get('/admin/login', function () {
    if (auth()->check() && auth()->user()->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }

    return Inertia::render('Admin/Login');
})->name('admin.login');

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/Admin', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin', fn () => redirect()->route('admin.dashboard'));

    Route::patch('/admin/users/{user}/toggle', [AdminController::class, 'toggleUser'])->name('admin.users.toggle');
    Route::delete('/admin/users/{user}', [AdminController::class, 'destroyUser'])->name('admin.users.destroy');

    Route::post('/admin/specialists', [AdminController::class, 'storeSpecialist'])->name('admin.specialists.store');
    Route::put('/admin/specialists/{specialist}', [AdminController::class, 'updateSpecialist'])->name('admin.specialists.update');
    Route::delete('/admin/specialists/{specialist}', [AdminController::class, 'destroySpecialist'])->name('admin.specialists.destroy');
    Route::patch('/admin/specialists/{specialist}/approve', [AdminController::class, 'approveSpecialist'])->name('admin.specialists.approve');
    Route::patch('/admin/specialists/{specialist}/reject', [AdminController::class, 'rejectSpecialist'])->name('admin.specialists.reject');

    Route::patch('/admin/articles/{article}/approve', [AdminController::class, 'approveArticle'])->name('admin.articles.approve');
    Route::patch('/admin/articles/{article}/reject', [AdminController::class, 'rejectArticle'])->name('admin.articles.reject');

    Route::post('/admin/questions', [AdminController::class, 'storeQuestion'])->name('admin.questions.store');
    Route::put('/admin/questions/{question}', [AdminController::class, 'updateQuestion'])->name('admin.questions.update');
    Route::patch('/admin/questions/{question}/toggle', [AdminController::class, 'toggleQuestion'])->name('admin.questions.toggle');
    Route::delete('/admin/questions/{question}', [AdminController::class, 'destroyQuestion'])->name('admin.questions.destroy');

    Route::put('/admin/scoring-rules/{scoringRule}', [AdminController::class, 'updateScoringRule'])->name('admin.scoring-rules.update');
    Route::get('/admin/export/assessments', [AdminController::class, 'exportAssessmentsCsv'])->name('admin.export.assessments');
});

require __DIR__.'/auth.php';
