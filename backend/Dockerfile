FROM php:8.2-fpm-alpine

# Installer les dépendances système et PostgreSQL
RUN apk add --no-cache \
    nginx \
    shadow \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    libzip-dev \
    unzip \
    git \
    curl \
    postgresql-dev

# Installer les extensions PHP requises par Laravel
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql gd zip

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Définir le dossier de travail
WORKDIR /var/www

# Copier les fichiers du projet
COPY . .

# Installer les dépendances Laravel sans les packages de dev
RUN composer install --no-dev --optimize-autoloader

# Donner les permissions aux dossiers de stockage
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Mettre en place le script de déploiement
COPY deploy.sh /usr/local/bin/deploy.sh
RUN chmod +x /usr/local/bin/deploy.sh

# Exposer le port requis par Render
EXPOSE 10000

# Lancer le script au démarrage du conteneur
CMD ["/usr/local/bin/deploy.sh"]