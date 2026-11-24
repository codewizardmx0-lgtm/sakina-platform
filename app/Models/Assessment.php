<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Assessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_score',
        'mood_score',
        'anxiety_score',
        'burnout_score',
        'severity_level',
        'recommendation',
        'answers',
    ];

    protected function casts(): array
    {
        return [
            'answers' => 'array',
            'total_score' => 'integer',
            'mood_score' => 'integer',
            'anxiety_score' => 'integer',
            'burnout_score' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
