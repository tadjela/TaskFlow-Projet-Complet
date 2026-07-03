# TaskFlow — Application Web de Gestion de Tâches

Application complète (React + Laravel + MySQL) générée à partir du cahier des
charges, du dossier de conception et du dossier de conception visuelle fournis.

- **Front-end** : React 18 (Vite) + React Router + Bootstrap 5 + Axios + Context API + Chart.js
- **Back-end** : Laravel 12 (API REST) + Laravel Sanctum (auth par token)
- **Base de données** : MySQL

## Structure du projet

```
taskflow/
├── backend/     Code source Laravel (API REST)
└── frontend/    Code source React (Vite)
```

---

## 1. Installation du back-end (Laravel)

### Prérequis
- PHP >= 8.2, Composer
- MySQL

### Étapes

```bash
cd backend

# Installer les dépendances (télécharge le framework Laravel + Sanctum)
composer install

# Copier le fichier d'environnement puis générer la clé d'application
cp .env.example .env
php artisan key:generate

# Configurer la base de données dans .env (DB_DATABASE, DB_USERNAME, DB_PASSWORD)
# puis créer la base MySQL "taskflow" (ou le nom choisi)

# Lancer les migrations + le seeder de démonstration
php artisan migrate --seed

# Créer le lien symbolique de stockage (avatars)
php artisan storage:link

# Démarrer le serveur de développement
php artisan serve
```

L'API est alors disponible sur **http://localhost:8000/api**.

### Comptes de démonstration créés par le seeder

| Rôle          | E-mail               | Mot de passe |
|---------------|-----------------------|--------------|
| Administrateur | admin@taskflow.test   | password     |
| Utilisateur    | demo@taskflow.test    | password     |

### Endpoints principaux

| Méthode | Endpoint                  | Description                          |
|---------|----------------------------|---------------------------------------|
| POST    | /api/register              | Inscription                          |
| POST    | /api/login                 | Connexion                            |
| POST    | /api/logout                | Déconnexion                          |
| GET     | /api/user                  | Utilisateur connecté                 |
| PUT     | /api/profile               | Mise à jour du profil                |
| PUT     | /api/password               | Changement de mot de passe           |
| GET/POST/PUT/DELETE | /api/tasks       | CRUD des tâches                      |
| PATCH   | /api/tasks/{id}/status      | Changement rapide de statut          |
| GET/POST/PUT/DELETE | /api/categories  | CRUD des catégories                  |
| GET     | /api/dashboard              | Statistiques du tableau de bord      |
| GET/PUT/DELETE | /api/admin/users     | Gestion des utilisateurs (admin)     |
| GET     | /api/admin/statistics        | Statistiques globales (admin)        |
| GET     | /api/admin/logs               | Journal d'activité (admin)           |

---

## 2. Installation du front-end (React + Vite)

### Prérequis
- Node.js >= 18, npm

### Étapes

```bash
cd frontend

# Installer les dépendances
npm install

# Copier le fichier d'environnement (adapter l'URL de l'API si besoin)
cp .env.example .env

# Démarrer le serveur de développement
npm run dev
```

L'application est alors disponible sur **http://localhost:5173**.

### Build de production

```bash
npm run build
```

---

## 3. Fonctionnalités implémentées

- Authentification complète (inscription, connexion, déconnexion, profil, mot de passe) via Laravel Sanctum.
- Gestion complète des tâches (CRUD), avec recherche, filtres (statut, priorité, catégorie), tri et pagination.
- Gestion des catégories personnalisées (nom, couleur).
- Tableau de bord utilisateur avec statistiques et graphiques (Chart.js).
- Interface d'administration : gestion des utilisateurs, statistiques globales, journal d'activité.
- Notifications Toast après chaque action.
- Interface responsive (Bootstrap 5), palette de couleurs conforme au dossier de conception visuelle
  (bleu #007BFF, vert #28A745, rouge #DC3545, jaune #FFC107), police Roboto.
- Protection des routes côté front (ProtectedRoute / AdminRoute) et côté back (middleware auth/admin).

## 4. Notes techniques

- Le back-end utilise la structure Laravel 12 (`bootstrap/app.php`, sans `app/Http/Kernel.php`, middleware et routing enregistrés directement dans `bootstrap/app.php`).
- Les tokens d'authentification (Sanctum) sont stockés côté client dans `localStorage` et transmis
  via l'en-tête `Authorization: Bearer <token>`.
- CORS est configuré pour autoriser l'origine définie par `FRONTEND_URL` dans le `.env` du back-end.






