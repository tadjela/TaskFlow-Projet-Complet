#!/bin/sh

echo "=== DEBUT DU SCRIPT DE DEPLOIEMENT ==="

# Exécuter les migrations et le seeder au démarrage
php artisan migrate:fresh --seed --force || echo "Attention : La base de données n'est pas encore accessible."

echo "=== DEMARRAGE DU SERVEUR ==="
php artisan serve --host=0.0.0.0 --port=10000