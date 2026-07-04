#!/bin/sh

# Optimisations des caches Laravel
php artisan config:cache
php artisan route:cache

# Exécution propre des migrations et des données de test
php artisan migrate:fresh --seed --force

# Lancement officiel du serveur requis par Render
php artisan serve --host=0.0.0.0 --port=10000