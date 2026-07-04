<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition(): array
    {
        // Listes simples pour générer de faux profils sans aucun package externe
        $prenoms = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Lucas', 'Emma', 'Thomas', 'Julie'];
        $noms = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand'];

        $randomName = $prenoms[array_rand($prenoms)] . ' ' . $noms[array_rand($noms)];
        $uniqueId = uniqid();

        return [
            'name' => $randomName,
            'email' => strtolower(Str::slug($randomName)) . '.' . $uniqueId . '@taskflow.test',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'remember_token' => Str::random(10),
            'role' => 'user',
            'is_active' => true,
        ];
    }

    public function admin(): static
    {
        return $this->state(fn(array $attributes) => [
            'role' => 'admin',
        ]);
    }
}
