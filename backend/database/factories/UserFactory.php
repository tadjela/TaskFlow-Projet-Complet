<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Faker\Factory as Faker; // 🌟 Importation directe du générateur de fausses données

class UserFactory extends Factory
{
    public function definition(): array
    {
        // Création manuelle de l'instance pour contourner les bugs d'environnement
        $faker = Faker::create();

        return [
            'name' => $faker->name(),
            'email' => $faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'remember_token' => Str::random(10),
            'role' => 'user',
            'is_active' => true,
        ];
    }
}
