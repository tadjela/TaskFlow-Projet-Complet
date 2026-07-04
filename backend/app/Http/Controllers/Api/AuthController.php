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

    public function login(LoginRequest $request)
    {
        // Compte de démonstration
        if (
            $request->email === 'demo@taskflow.test' &&
            $request->password === 'password'
        ) {
            $user = User::firstOrCreate(
                ['email' => 'demo@taskflow.test'],
                [
                    'name' => 'Utilisateur Démo',
                    'password' => Hash::make('password'),
                    'role' => 'user',
                    'is_active' => true,
                ]
            );
        } else {
            // Authentification normale
            if (!Auth::attempt($request->only('email', 'password'))) {
                return response()->json([
                    'message' => 'Identifiants invalides.'
                ], 401);
            }

            $user = Auth::user();
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Ce compte a été désactivé.',
            ], 403);
        }

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

        return response()->json([
            'message' => 'Déconnexion réussie.'
        ]);
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

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => "L'ancien mot de passe est incorrect.",
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        ActivityLog::record($user->id, 'update_password', 'Mot de passe modifié.');

        return response()->json([
            'message' => 'Mot de passe modifié avec succès.'
        ]);
    }
}
