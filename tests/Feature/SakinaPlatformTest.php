<?php

namespace Tests\Feature;

use App\Models\Question;
use App\Models\SpecialistProfile;
use App\Models\User;
use Database\Seeders\SakinaSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SakinaPlatformTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_pages_load_successfully(): void
    {
        $this->seed(SakinaSeeder::class);

        $this->get('/')->assertStatus(200);
        $this->get('/assessment')->assertStatus(200);
        $this->get('/specialists-directory')->assertStatus(200);
        $this->get('/articles')->assertStatus(200);
    }

    public function test_assessment_calculates_scores_and_redirects_to_result(): void
    {
        $this->seed(SakinaSeeder::class);
        $questions = Question::orderBy('order_index')->get();

        $answers = [];
        foreach ($questions as $q) {
            $answers[$q->id] = 2; // 14 * 2 = 28 (moderate)
        }

        $response = $this->post('/assessment', ['answers' => $answers]);

        $response->assertRedirect();
        $this->assertDatabaseHas('assessments', [
            'total_score' => 28,
            'mood_score' => 10,
            'anxiety_score' => 10,
            'burnout_score' => 8,
            'severity_level' => 'moderate',
        ]);
    }

    public function test_admin_dashboard_is_protected_by_role(): void
    {
        $this->seed(SakinaSeeder::class);

        $beneficiary = User::where('email', 'user@sakina.com')->first();
        $this->actingAs($beneficiary)->get('/Admin')->assertStatus(403);

        $admin = User::where('email', 'admin@sakina.com')->first();
        $this->actingAs($admin)->get('/Admin')->assertStatus(200);
    }

    public function test_dedicated_login_portals_and_consultation_requests_work(): void
    {
        $this->seed(SakinaSeeder::class);

        $this->get('/admin/login')->assertStatus(200);
        $this->get('/specialist/login')->assertStatus(200);

        $specialist = SpecialistProfile::where('is_approved', true)->first();

        $this->post('/consultations', [
            'specialist_profile_id' => $specialist->id,
            'beneficiary_name' => 'أحمد علي',
            'beneficiary_phone' => '771122334',
            'preferred_time' => 'المساء',
            'notes' => 'استشارة أولية',
        ])->assertRedirect();

        $this->assertDatabaseHas('consultation_requests', [
            'beneficiary_name' => 'أحمد علي',
            'specialist_profile_id' => $specialist->id,
            'status' => 'pending',
        ]);
    }

    public function test_assessment_result_privacy_and_mood_logs_and_admin_export(): void
    {
        $this->seed(SakinaSeeder::class);

        $beneficiary = User::where('email', 'user@sakina.com')->first();
        $assessment = $beneficiary->assessments()->first();

        // Another user cannot view beneficiary's assessment result
        $otherUser = User::factory()->create(['role' => 'beneficiary']);
        $this->actingAs($otherUser)->get("/assessment/result/{$assessment->id}")->assertStatus(403);

        // Owner can view
        $this->actingAs($beneficiary)->get("/assessment/result/{$assessment->id}")->assertStatus(200);

        // Beneficiary can log daily mood
        $this->actingAs($beneficiary)->post('/user/moods', [
            'mood' => 'calm',
            'note' => 'شعور بالهدوء',
        ])->assertRedirect();

        $this->assertDatabaseHas('mood_logs', [
            'user_id' => $beneficiary->id,
            'mood' => 'calm',
        ]);

        // Admin can export anonymized CSV
        $admin = User::where('email', 'admin@sakina.com')->first();
        $this->actingAs($admin)->get('/admin/export/assessments')->assertStatus(200);
    }
}
