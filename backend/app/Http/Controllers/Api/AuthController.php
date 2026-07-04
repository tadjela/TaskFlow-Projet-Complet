<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
        ]);

        $token = $user->createToken('taskflow')->plainTextToken;

        ActivityLog::record($user->id, 'register', 'Nouvel utilisateur inscrit.');

        return response()->json([
            'message' => 'Inscription réussie.',
            'user' => new UserResource($user),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        // 1. Gestion des comptes de test (Admin et Démo)
        if ($request->email === 'admin@taskflow.test' && $request->password === 'password') {

            $user = User::firstOrCreate(
                ['email' => 'admin@taskflow.test'],
                [
                    'name' => 'Administrateur',
                    'password' => Hash::make('password'),
                    'role' => 'admin',
                ]
            );
        } elseif ($request->email === 'demo@taskflow.test' && $request->password === 'password') {

            $user = User::firstOrCreate(
                ['email' => 'demo@taskflow.test'],
                [
                    'name' => 'Utilisateur Démo',
                    'password' => Hash::make('password'),
                    'role' => 'user',
                ]
            );
        } else {
            // 2. Authentification classique pour les autres utilisateurs en base de données
            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'message' => 'Identifiants incorrects.',
                ], 401);
            }
        }

        // 3. Vérification commune du statut du compte (Actif / Inactif)
        if (!$user->is_active) {
            return response()->json([
                'message' => 'Ce compte a été désactivé.',
            ], 403);
        }

        // 4. Génération du jeton et journalisation de l'activité
        $token = $user->createToken('taskflow')->plainTextToken;

        ActivityLog::record($user->id, 'login', 'Connexion réussie.');

        return response()->json([
            'message' => 'Connexion réussie.',
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    public function logout()
    {
        $user = Auth::user();
        $user->currentAccessToken()->delete();

        ActivityLog::record($user->id, 'logout', 'Déconnexion.');

        return response()->json(['message' => 'Déconnexion réussie.']);
    }

    public function me()
    {
        return new UserResource(Auth::user());
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = Auth::user();
        $user->fill($request->only(['name', 'email']));

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $user->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        $user->save();

        ActivityLog::record($user->id, 'update_profile', 'Profil mis à jour.');

        return response()->json([
            'message' => 'Profil mis à jour avec succès.',
            'user' => new UserResource($user),
        ]);
    }

    public function updatePassword(UpdatePasswordRequest $request)
    {
        $user = Auth::user();

        if (! Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => "L'ancien mot de passe est incorrect.",
            ], 422);
        }

        $user->update(['password' => Hash::make($request->password)]);

        ActivityLog::record($user->id, 'update_password', 'Mot de passe modifié.');

        return response()->json(['message' => 'Mot de passe modifié avec succès.']);
    }
}
