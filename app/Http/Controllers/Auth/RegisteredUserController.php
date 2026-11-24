<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\SpecialistProfile;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'nullable|in:beneficiary,specialist',
            'phone' => 'nullable|string|max:20',
            'specialty' => 'nullable|string|max:255',
        ]);

        $role = $request->input('role', 'beneficiary');

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $role,
            'phone' => $request->phone,
            'is_active' => true,
        ]);

        if ($role === 'specialist') {
            SpecialistProfile::create([
                'user_id' => $user->id,
                'title' => 'أخصائي نفسي',
                'specialty' => $request->input('specialty') ?: 'الاستشارات النفسية العامة',
                'experience_years' => 3,
                'bio' => 'مختص في تقديم الدعم النفسي والإرشاد الأولي.',
                'contact_phone' => $request->input('phone') ?: '770000000',
                'is_approved' => false,
            ]);
        }

        event(new Registered($user));

        Auth::login($user);

        if ($role === 'specialist') {
            return redirect()->route('specialist.dashboard');
        }

        return redirect()->route('user.profile');
    }
}
