<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Force l'insertion SQL à CHAQUE démarrage de l'application sur Render
        try {
            DB::table('users')->updateOrInsert(
                ['email' => 'admin@gmail.com'],
                [
                    'name' => 'Administrateur TaskFlow',
                    'password' => Hash::make('password123'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        } catch (\Exception $e) {
            // Évite de bloquer l'application si la table users n'existe pas encore
        }
    }
}
