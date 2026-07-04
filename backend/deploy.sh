#!/bin/sh

# 1. On force la réinitialisation de la BDD et le seed immédiatement
php artisan migrate:fresh --seed --force

# 2. On met en cache (optionnel)
php artisan config:cache
php artisan route:cache

# 3. Lancement officiel du serveur requis par Render
php artisan serve --host=0.0.0.0 --port=10000