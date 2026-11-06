<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardPropsTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_shows_empty_state_for_new_user(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(function (Assert $page) use ($user) {
                return $page
                    ->component('dashboard')
                    ->where('userName', $user->name)
                    ->where('hasProperty', false)
                    ->where('documentsCount', 0);
            });
    }

    public function test_dashboard_reflects_property_and_documents(): void
    {
        $user = User::factory()->create();
        $user->property()->create([
            'name' => 'Rosewood Residence',
            'address' => '12 Maple Street',
        ]);
        $user->documents()->create([
            'name' => 'deed.pdf',
            'path' => 'documents/deed-1.pdf',
            'size' => 1024,
        ]);
        $user->documents()->create([
            'name' => 'valuation.pdf',
            'path' => 'documents/valuation-1.pdf',
            'size' => 2048,
        ]);

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(function (Assert $page) use ($user) {
                return $page
                    ->component('dashboard')
                    ->where('userName', $user->name)
                    ->where('hasProperty', true)
                    ->where('documentsCount', 2);
            });
    }

    public function test_dashboard_does_not_count_other_users_documents(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $otherUser->documents()->create([
            'name' => 'their-doc.pdf',
            'path' => 'documents/their-doc-1.pdf',
            'size' => 512,
        ]);

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('documentsCount', 0));
    }
}
