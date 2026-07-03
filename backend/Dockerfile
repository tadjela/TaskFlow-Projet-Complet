FROM php:8.3-fpm-alpine

# Installation des dépendances système et extensions PHP nécessaires pour PostgreSQL et Laravel
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

# Configuration des permissions pour Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Installation des dépendances du projet
RUN composer install --no-dev --optimize-autoloader

# Exposition du port utilisé par Render
EXPOSE 80

# Commande de démarrage (Lance les migrations puis démarre le serveur intégré pour faire simple)
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=80