<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::withCount('tasks');

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->string('role'));
        }

        $users = $query->orderByDesc('created_at')->paginate($request->get('per_page', 10));

        return UserResource::collection($users);
    }

    public function show(User $user)
    {
        return new UserResource($user->loadCount('tasks'));
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'role' => ['sometimes', 'in:user,admin'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $user->update($request->only(['role', 'is_active']));

        ActivityLog::record($request->user()->id, 'admin_update_user', "Utilisateur modifié : {$user->email}");

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès.',
            'user' => new UserResource($user),
        ]);
    }

    public function destroy(Request $request, User $user)
    {
        abort_if($user->id === $request->user()->id, 422, 'Vous ne pouvez pas supprimer votre propre compte.');

        $email = $user->email;
        $user->delete();

        ActivityLog::record($request->user()->id, 'admin_delete_user', "Utilisateur supprimé : {$email}");

        return response()->json(['message' => 'Utilisateur supprimé avec succès.']);
    }
}
