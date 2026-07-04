#!/bin/sh

echo "=== DEBUT DU SCRIPT DE DEPLOIEMENT ==="

# On lance la migration et on affiche l'erreur s'il y en a une
php artisan migrate:fresh --seed --force || echo "ATTENTION : Echec de la migration ou du seed !"

echo "=== FIN DES MIGRATIONS - DEMARRAGE DU SERVEUR ==="

# Lancement officiel du serveur requis par Render
php artisan serve --host=0.0.0.0 --port=10000