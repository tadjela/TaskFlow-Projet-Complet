<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $total = Task::forUser($userId)->count();
        $todo = Task::forUser($userId)->where('status', 'a_faire')->count();
        $inProgress = Task::forUser($userId)->where('status', 'en_cours')->count();
        $done = Task::forUser($userId)->where('status', 'terminee')->count();
        $overdue = Task::forUser($userId)->overdue()->count();

        $upcoming = Task::forUser($userId)
            ->with('category')
            ->whereNotNull('deadline')
            ->whereDate('deadline', '>=', now()->toDateString())
            ->where('status', '!=', 'terminee')
            ->orderBy('deadline')
            ->limit(5)
            ->get();

        $byPriority = Task::forUser($userId)
            ->selectRaw('priority, count(*) as total')
            ->groupBy('priority')
            ->pluck('total', 'priority');

        return response()->json([
            'stats' => [
                'total' => $total,
                'a_faire' => $todo,
                'en_cours' => $inProgress,
                'terminee' => $done,
                'en_retard' => $overdue,
                'taux_achevement' => $total > 0 ? round(($done / $total) * 100, 1) : 0,
            ],
            'by_priority' => [
                'basse' => $byPriority['basse'] ?? 0,
                'moyenne' => $byPriority['moyenne'] ?? 0,
                'haute' => $byPriority['haute'] ?? 0,
            ],
            'upcoming_tasks' => \App\Http\Resources\TaskResource::collection($upcoming),
        ]);
    }
}
