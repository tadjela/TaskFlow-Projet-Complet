<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('tasks')
            ->where('user_id', Auth::id())
            ->orderBy('name')
            ->get();

        return CategoryResource::collection($categories);
    }

    public function store(CategoryRequest $request)
    {
        $category = Category::create([
            ...$request->validated(),
            'user_id' => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Catégorie créée avec succès.',
            'category' => new CategoryResource($category),
        ], 201);
    }

    public function update(CategoryRequest $request, Category $category)
    {
        $this->authorizeOwnership($category);

        $category->update($request->validated());

        return response()->json([
            'message' => 'Catégorie modifiée avec succès.',
            'category' => new CategoryResource($category),
        ]);
    }

    public function destroy(Category $category)
    {
        $this->authorizeOwnership($category);

        $category->delete();

        return response()->json(['message' => 'Catégorie supprimée avec succès.']);
    }

    protected function authorizeOwnership(Category $category): void
    {
        abort_if($category->user_id !== Auth::id(), 403, 'Accès non autorisé à cette catégorie.');
    }
}
