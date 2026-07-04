<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Artisan;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Étape de secours : On exécute d'abord votre DatabaseSeeder d'origine
        try {
            Artisan::call('db:seed', ['--force' => true]);
        } catch (\Exception $e) {
            // Si le seeder d'origine échoue, on ignore l'erreur pour passer à la suite
        }

        // 2. Étape de sécurité : On force la création d'un compte avec un email standard (.com)
        // Cela évite les bugs de rejet avec l'extension de mail (.test) en production
        DB::table('users')->updateOrInsert(
            ['email' => 'admin@gmail.com'], // Votre identifiant de connexion
            [
                'name' => 'Administrateur TaskFlow',
                'password' => Hash::make('password123'), // Votre mot de passe de connexion
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Supprime l'utilisateur de sécurité si on annule la migration
        DB::table('users')->where('email', 'admin@gmail.com')->delete();
    }
};
