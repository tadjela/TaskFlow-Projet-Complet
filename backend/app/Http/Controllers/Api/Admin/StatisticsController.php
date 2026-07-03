<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;

class StatisticsController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $activeUsers = User::where('is_active', true)->count();
        $admins = User::where('role', 'admin')->count();

        $totalTasks = Task::count();
        $doneTasks = Task::where('status', 'terminee')->count();
        $overdueTasks = Task::overdue()->count();

        $tasksByStatus = Task::selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $tasksByPriority = Task::selectRaw('priority, count(*) as total')
            ->groupBy('priority')
            ->pluck('total', 'priority');

        $topUsers = User::withCount('tasks')
            ->orderByDesc('tasks_count')
            ->limit(5)
            ->get(['id', 'name', 'email']);

        return response()->json([
            'users' => [
                'total' => $totalUsers,
                'actifs' => $activeUsers,
                'admins' => $admins,
            ],
            'tasks' => [
                'total' => $totalTasks,
                'terminees' => $doneTasks,
                'en_retard' => $overdueTasks,
                'taux_achevement' => $totalTasks > 0 ? round(($doneTasks / $totalTasks) * 100, 1) : 0,
            ],
            'tasks_by_status' => $tasksByStatus,
            'tasks_by_priority' => $tasksByPriority,
            'top_users' => $topUsers,
        ]);
    }
}
