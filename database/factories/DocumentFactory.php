<?php

namespace Database\Factories;

use App\Models\Document;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Document>
 */
class DocumentFactory extends Factory
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
            'name' => fake()->word().'.pdf',
            'path' => 'documents/'.fake()->uuid(),
            'size' => fake()->numberBetween(1_000, 5_000_000),
            'mime_type' => 'application/pdf',
        ];
    }
}
