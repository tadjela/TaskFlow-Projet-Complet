<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        $categories = ['Développement', 'Design', 'Marketing', 'Bug Fix', 'Infrastructure', 'Réunion'];

        return [
            'name' => $categories[array_rand($categories)] . ' ' . uniqid(),
        ];
    }
}
