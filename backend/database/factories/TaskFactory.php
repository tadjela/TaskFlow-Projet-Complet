<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        // Tableaux de données fictives pour les tâches
        $titres = ['Corriger les bugs Auth', 'Déployer sur Render', 'Créer la base de données', 'Rédiger la documentation', 'Tester les API', 'Optimiser le code React'];
        $descriptions = ['Il faut finaliser ce module rapidement.', 'Vérifier les variables d’environnement avant de lancer.', 'Ajouter les index sur les tables clés.', 'Mettre à jour le fichier README.md.', 'Faire des tests de bout en bout avec Postman.'];
        $statuts = ['todo', 'in_progress', 'done'];

        return [
            'title' => $titres[array_rand($titres)],
            'description' => $descriptions[array_rand($descriptions)],
            'status' => $statuts[array_rand($statuts)],
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(), // Associe à un utilisateur existant ou en crée un
            'category_id' => Category::inRandomOrder()->first()?->id ?? Category::factory(), // Associe à une catégorie existante ou en crée une
        ];
    }
}
