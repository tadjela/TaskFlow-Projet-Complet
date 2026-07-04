<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement(['Travail', 'Personnel', 'Études', 'Santé', 'Projets']) . ' ' . $this->faker->unique()->randomNumber(5),
            'color' => $this->faker->randomElement(['#007BFF', '#28A745', '#DC3545', '#FFC107']),
        ];
    }
}
