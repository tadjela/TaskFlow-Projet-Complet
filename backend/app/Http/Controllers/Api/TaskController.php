<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\ActivityLog;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::with('category')->forUser(Auth::id());

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->string('priority'));
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        if ($request->boolean('overdue')) {
            $query->overdue();
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');

        $allowedSorts = ['deadline', 'priority', 'created_at', 'title'];
        if (! in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }

        $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');

        $perPage = (int) $request->get('per_page', 10);
        $tasks = $query->paginate($perPage);

        return TaskResource::collection($tasks);
    }

    public function store(TaskRequest $request)
    {
        $task = Task::create([
            ...$request->validated(),
            'user_id' => Auth::id(),
        ]);

        ActivityLog::record(Auth::id(), 'create_task', "Tâche créée : {$task->title}");

        return response()->json([
            'message' => 'Tâche créée avec succès.',
            'task' => new TaskResource($task->load('category')),
        ], 201);
    }

    public function show(Task $task)
    {
        $this->authorizeOwnership($task);

        return new TaskResource($task->load('category'));
    }

    public function update(TaskRequest $request, Task $task)
    {
        $this->authorizeOwnership($task);

        $task->update($request->validated());

        ActivityLog::record(Auth::id(), 'update_task', "Tâche modifiée : {$task->title}");

        return response()->json([
            'message' => 'Tâche modifiée avec succès.',
            'task' => new TaskResource($task->load('category')),
        ]);
    }

    public function destroy(Task $task)
    {
        $this->authorizeOwnership($task);

        $title = $task->title;
        $task->delete();

        ActivityLog::record(Auth::id(), 'delete_task', "Tâche supprimée : {$title}");

        return response()->json(['message' => 'Tâche supprimée avec succès.']);
    }

    public function updateStatus(Request $request, Task $task)
    {
        $this->authorizeOwnership($task);

        $request->validate([
            'status' => ['required', 'in:a_faire,en_cours,terminee'],
        ]);

        $task->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Statut mis à jour.',
            'task' => new TaskResource($task->load('category')),
        ]);
    }

    protected function authorizeOwnership(Task $task): void
    {
        abort_if($task->user_id !== Auth::id(), 403, 'Accès non autorisé à cette tâche.');
    }
}
