<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::factory()->admin()->create([
            'name' => 'Admin TaskFlow',
            'email' => 'admin@taskflow.test',
        ]);

        $user = User::factory()->create([
            'name' => 'Utilisateur Démo',
            'email' => 'demo@taskflow.test',
        ]);

        User::factory(8)->create();

        foreach (User::where('role', 'user')->get() as $u) {
            $categories = Category::factory(3)->create(['user_id' => $u->id]);

            Task::factory(12)->create([
                'user_id' => $u->id,
                'category_id' => fn() => fake()->boolean(80) ? $categories->random()->id : null,
            ]);
        }

        $this->command->info('Comptes de démonstration :');
        $this->command->info('  Admin : admin@taskflow.test / password');
        $this->command->info('  User  : demo@taskflow.test / password');
    }
}
