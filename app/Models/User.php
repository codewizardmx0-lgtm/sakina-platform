<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'birth_date',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'birth_date' => 'date',
            'is_active' => 'boolean',
            'password' => 'hashed',
        ];
    }

    public function specialistProfile(): HasOne
    {
        return $this->hasOne(SpecialistProfile::class);
    }

    public function assessments(): HasMany
    {
        return $this->hasMany(Assessment::class)->latest();
    }

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class, 'author_id')->latest();
    }

    public function consultationRequests(): HasMany
    {
        return $this->hasMany(ConsultationRequest::class)->latest();
    }

    public function moodLogs(): HasMany
    {
        return $this->hasMany(MoodLog::class)->latest();
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isSpecialist(): bool
    {
        return $this->role === 'specialist';
    }

    public function isBeneficiary(): bool
    {
        return $this->role === 'beneficiary';
    }
}
