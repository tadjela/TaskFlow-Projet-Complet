<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Crée l'ADMIN uniquement s'il n'existe pas
        User::firstOrCreate(
            ['email' => 'admin@taskflow.test'],
            [
                'name' => 'Administrateur',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        // 2. Crée le compte DEMO uniquement s'il n'existe pas
        User::firstOrCreate(
            ['email' => 'demo@taskflow.test'],
            [
                'name' => 'Utilisateur Démo',
                'password' => Hash::make('password'),
                'role' => 'user',
                'is_active' => true,
            ]
        );

        // 3. Génère 10 utilisateurs aléatoires via la factory
        User::factory(10)->create();
    }
}
