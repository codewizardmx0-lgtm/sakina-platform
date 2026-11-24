<?php

namespace App\Http\Controllers;

use App\Models\SpecialistProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SpecialistDirectoryController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->value();

        $specialists = SpecialistProfile::with('user:id,name,email')
            ->where('is_approved', true)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('specialty', 'like', "%{$search}%")
                        ->orWhere('title', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%"));
                });
            })
            ->get();

        return Inertia::render('Specialists/Directory', [
            'specialists' => $specialists,
            'filters' => ['search' => $search],
        ]);
    }
}
