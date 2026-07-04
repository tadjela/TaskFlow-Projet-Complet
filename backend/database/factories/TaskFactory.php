<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->boolean(70) ? $this->faker->paragraph() : null,
            'priority' => $this->faker->randomElement(['basse', 'moyenne', 'haute']),
            'status' => $this->faker->randomElement(['a_faire', 'en_cours', 'terminee']),
            'deadline' => $this->faker->boolean(80) ? $this->faker->dateTimeBetween('-10 days', '+30 days') : null,
        ];
    }
}
