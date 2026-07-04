<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Artisan;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Cette ligne appelle directement votre DatabaseSeeder d'origine avec le flag force pour la production
        Artisan::call('db:seed', ['--force' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Rien à faire ici
    }
};
