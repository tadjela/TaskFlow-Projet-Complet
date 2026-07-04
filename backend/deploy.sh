#!/bin/sh

# Désactiver temporairement le cache pour éviter les conflits
php artisan config:clear
php artisan route:clear

# Forcer la suppression de toutes les tables existantes et réexécuter le seeder
php artisan migrate:fresh --seed --force
#
# Lancement officiel du serveur requis par Render
php artisan serve --host=0.0.0.0 --port=10000