<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        $titres = ['Corriger les bugs Auth', 'Déployer sur Render', 'Créer la base de données', 'Rédiger la documentation', 'Tester les API', 'Optimiser le code React'];
        $descriptions = ['Il faut finaliser ce module rapidement.', 'Vérifier les variables d’environnement avant de lancer.', 'Ajouter les index sur les tables clés.', 'Mettre à jour le fichier README.md.', 'Faire des tests de bout en bout avec Postman.'];
        $statuts = ['a_faire', 'en_cours', 'terminee'];
        $priorites = ['basse', 'moyenne', 'haute'];

        return [
            'title' => $titres[array_rand($titres)],
            'description' => $descriptions[array_rand($descriptions)],
            'status' => $statuts[array_rand($statuts)],
            'priority' => $priorites[array_rand($priorites)], // Aligné sur votre enum de migration
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'category_id' => Category::inRandomOrder()->first()?->id ?? Category::factory(),
        ];
    }
}
