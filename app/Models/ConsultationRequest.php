<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConsultationRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'specialist_profile_id',
        'assessment_id',
        'share_assessment',
        'beneficiary_name',
        'beneficiary_phone',
        'preferred_time',
        'notes',
        'status',
        'specialist_notes',
    ];

    protected function casts(): array
    {
        return [
            'share_assessment' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function specialistProfile(): BelongsTo
    {
        return $this->belongsTo(SpecialistProfile::class);
    }

    public function assessment(): BelongsTo
    {
        return $this->belongsTo(Assessment::class);
    }
}
