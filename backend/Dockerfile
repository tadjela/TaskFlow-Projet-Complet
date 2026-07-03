FROM php:8.3-cli

# Installation des dépendances système indispensables (PostgreSQL, zip, unzip)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo pdo_pgsql zip

# Récupération de l'outil Composer officiel
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Définition du répertoire de travail
WORKDIR /var/www/html
COPY . .

# Configuration des droits d'accès nécessaires pour Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Installation propre des dépendances PHP sans packages de développement
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Exposition du port requis par Render
EXPOSE 10000

# Commande de démarrage : Configuration des caches, exécution des migrations et lancement du serveur
CMD php artisan config:cache && php artisan route:cache && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=10000