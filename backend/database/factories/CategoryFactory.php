<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['Travail', 'Personnel', 'Études', 'Santé', 'Projets']) . ' ' . fake()->unique()->randomNumber(5),
            'color' => fake()->randomElement(['#007BFF', '#28A745', '#DC3545', '#FFC107']),
        ];
    }
}
