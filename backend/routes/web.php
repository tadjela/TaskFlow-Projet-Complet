<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'TaskFlow API - voir /api pour les routes disponibles.',
    ]);
});
