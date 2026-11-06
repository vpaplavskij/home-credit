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

    public function test_size_sqm_must_be_within_bounds(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->put('/my-home', [
            'name' => 'Tiny Shack',
            'address' => '1 Small St',
            'size_sqm' => 5, // below min of 10
        ])->assertSessionHasErrors('size_sqm');

        $this->actingAs($user)->put('/my-home', [
            'name' => 'Mega Estate',
            'address' => '1 Big Ave',
            'size_sqm' => 200000, // above max of 100000
        ])->assertSessionHasErrors('size_sqm');

        // A valid size still saves fine.
        $this->actingAs($user)->put('/my-home', [
            'name' => 'Normal House',
            'address' => '1 Ok Rd',
            'size_sqm' => 120,
        ])->assertRedirect(route('my-home'));
    }

    public function test_purchased_at_cannot_be_in_the_future(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->put('/my-home', [
            'name' => 'Future Home',
            'address' => '1 Tomorrow Way',
            'purchased_at' => now()->addYear()->format('Y-m-d'),
        ])->assertSessionHasErrors('purchased_at');

        // A past date is accepted.
        $this->actingAs($user)->put('/my-home', [
            'name' => 'Past Home',
            'address' => '1 Yesterday Yrd',
            'purchased_at' => now()->subYear()->format('Y-m-d'),
        ])->assertRedirect(route('my-home'));
    }

    public function test_beds_and_baths_must_be_within_bounds(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->put('/my-home', [
            'name' => 'Many Rooms',
            'address' => '1 Big House',
            'beds' => 40, // above max of 32
        ])->assertSessionHasErrors('beds');

        $this->actingAs($user)->put('/my-home', [
            'name' => 'Many Baths',
            'address' => '1 Spa House',
            'baths' => 40, // above max of 32
        ])->assertSessionHasErrors('baths');
    }

    public function test_validation_errors_use_friendly_messages(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->put('/my-home', [
            'name' => '',
            'address' => '',
        ])->assertSessionHasErrors(['name', 'address']);

        // The custom message registered for name.required is what surfaces.
        $errors = session('errors');
        $this->assertSame(
            'Please give your property a name.',
            $errors->first('name'),
        );
    }

    public function test_index_returns_purchase_date_in_iso_format(): void
    {
        $user = User::factory()->create();
        $user->property()->create([
            'name' => 'Rosewood Residence',
            'address' => '12 Rosewood Lane, Springfield',
            'purchased_at' => '2023-03-15',
        ]);

        $this->actingAs($user)
            ->get('/my-home')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('my-home')
                ->where('property.purchased_at', '2023-03-15'));
    }

    public function test_numeric_fields_reject_non_numeric_input(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->put('/my-home', [
            'name' => 'Odd House',
            'address' => '1 Odd St',
            'size_sqm' => 'abc',
            'beds' => 'two',
        ])->assertSessionHasErrors(['size_sqm', 'beds']);

        $this->assertSame(0, $user->property()->count());
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
