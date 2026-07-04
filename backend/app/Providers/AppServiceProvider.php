<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Force l'exécution des migrations et du seeder directement depuis PHP
        try {
            if (!Schema::hasTable('users')) {
                Log::info('Table users manquante. Lancement des migrations...');

                // Exécute les migrations et le DatabaseSeeder proprement
                Artisan::call('migrate:fresh', [
                    '--seed' => true,
                    '--force' => true
                ]);

                Log::info('Migrations et Seeding terminés avec succès !');
            }
        } catch (\Exception $e) {
            Log::error('Erreur lors du rafraîchissement BDD : ' . $e->getMessage());
        }
    }
}
