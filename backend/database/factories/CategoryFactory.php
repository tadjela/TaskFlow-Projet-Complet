<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        $categories = ['Développement', 'Design', 'Marketing', 'Bug Fix', 'Infrastructure', 'Réunion'];

        return [
            'name' => $categories[array_rand($categories)] . ' ' . uniqid(),
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
        ];
    }
}
