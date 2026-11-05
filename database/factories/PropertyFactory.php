<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Property>
 */
class PropertyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->randomElement(['Rosewood Residence', 'Maple House', 'Hillside Villa']),
            'address' => fake()->streetAddress(),
            'size_sqm' => fake()->numberBetween(60, 400),
            'beds' => fake()->numberBetween(1, 6),
            'baths' => fake()->numberBetween(1, 4),
            'purchased_at' => fake()->dateTimeBetween('-5 years', 'now'),
            'owners' => fake()->name().' & '.fake()->lastName(),
        ];
    }
}
