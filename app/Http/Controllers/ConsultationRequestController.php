<?php

namespace App\Http\Controllers;

use App\Models\ConsultationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ConsultationRequestController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'specialist_profile_id' => 'required|exists:specialist_profiles,id',
            'assessment_id' => 'nullable|exists:assessments,id',
            'share_assessment' => 'boolean',
            'beneficiary_name' => 'required|string|max:255',
            'beneficiary_phone' => 'required|string|max:30',
            'preferred_time' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:1000',
        ]);

        $shareAssessment = (bool) ($validated['share_assessment'] ?? false);

        ConsultationRequest::create([
            'user_id' => $request->user()?->id,
            'specialist_profile_id' => $validated['specialist_profile_id'],
            'assessment_id' => $shareAssessment ? ($validated['assessment_id'] ?? null) : null,
            'share_assessment' => $shareAssessment,
            'beneficiary_name' => $validated['beneficiary_name'],
            'beneficiary_phone' => $validated['beneficiary_phone'],
            'preferred_time' => $validated['preferred_time'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        return back()->with('success', 'تم إرسال طلب التواصل الأولي بنجاح. سيتواصل معك المختص في الوقت المحدد.');
    }

    public function updateStatus(Request $request, ConsultationRequest $consultationRequest): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,contacted,completed,cancelled',
            'specialist_notes' => 'nullable|string|max:1000',
        ]);

        $user = $request->user();
        if ($user->role !== 'admin' && $consultationRequest->specialistProfile?->user_id !== $user->id) {
            abort(403);
        }

        $consultationRequest->update([
            'status' => $validated['status'],
            'specialist_notes' => $validated['specialist_notes'] ?? $consultationRequest->specialist_notes,
        ]);

        return back()->with('success', 'تم تحديث طلب الاستشارة بنجاح.');
    }
}
