<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'description' => fake()->boolean(70) ? fake()->paragraph() : null,
            'priority' => fake()->randomElement(['basse', 'moyenne', 'haute']),
            'status' => fake()->randomElement(['a_faire', 'en_cours', 'terminee']),
            'deadline' => fake()->boolean(80) ? fake()->dateTimeBetween('-10 days', '+30 days') : null,
        ];
    }
}
