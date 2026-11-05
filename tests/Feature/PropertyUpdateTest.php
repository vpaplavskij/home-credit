<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropertyUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_view_my_home(): void
    {
        $this->get('/my-home')->assertRedirect('/login');
    }

    public function test_user_can_view_my_home_page(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/my-home')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('my-home'));
    }

    public function test_user_can_update_property(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->put('/my-home', [
            'name' => 'Rosewood Residence',
            'address' => '12 Rosewood Lane, Springfield',
            'size_sqm' => 186,
            'beds' => 4,
            'baths' => 2,
            'purchased_at' => '2023-03-15',
            'owners' => 'Anna & Ben Kovač',
        ])->assertRedirect(route('my-home'));

        $property = $user->fresh()->property;

        $this->assertNotNull($property);
        $this->assertSame('Rosewood Residence', $property->name);
        $this->assertSame('12 Rosewood Lane, Springfield', $property->address);
        $this->assertSame(186, $property->size_sqm);
        $this->assertSame(4, $property->beds);
        $this->assertSame(2, $property->baths);
        $this->assertSame('2023-03-15', $property->purchased_at->format('Y-m-d'));
        $this->assertSame('Anna & Ben Kovač', $property->owners);
    }

    public function test_user_can_update_existing_property(): void
    {
        $user = User::factory()->create();
        $user->property()->create([
            'name' => 'Old Name',
            'address' => 'Old Address',
        ]);

        $this->actingAs($user)->put('/my-home', [
            'name' => 'New Name',
            'address' => 'New Address',
            'size_sqm' => null,
            'beds' => null,
            'baths' => null,
            'purchased_at' => null,
            'owners' => null,
        ])->assertRedirect(route('my-home'));

        $this->assertSame(1, $user->property()->count());
        $this->assertSame('New Name', $user->property->name);
    }

    public function test_update_requires_name_and_address(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->put('/my-home', [
            'name' => '',
            'address' => '',
        ])->assertSessionHasErrors(['name', 'address']);
    }

    public function test_index_and_update_with_empty_optional_fields(): void
    {
        // Mirrors the browser dialog submit: form-encoded PUT where empty
        // optional fields arrive as null. This is the path that previously
        // crashed with "Undefined property HasOne::$id".
        $user = User::factory()->create();

        // First visit (no property yet) must not error.
        $this->actingAs($user)
            ->get('/my-home')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('my-home'));

        // Submit with optional fields left blank.
        $this->actingAs($user)->put('/my-home', [
            'name' => 'Bare Bones House',
            'address' => '1 Nowhere Rd',
            'size_sqm' => null,
            'beds' => null,
            'baths' => null,
            'purchased_at' => null,
            'owners' => null,
        ])->assertRedirect(route('my-home'));

        $property = $user->fresh()->property;
        $this->assertNotNull($property);
        $this->assertSame('Bare Bones House', $property->name);
        $this->assertNull($property->size_sqm);
        $this->assertNull($property->purchased_at);

        // Re-visit must render the saved property without error.
        $this->actingAs($user)
            ->get('/my-home')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('my-home')
                ->where('property.name', 'Bare Bones House'));
    }
}
