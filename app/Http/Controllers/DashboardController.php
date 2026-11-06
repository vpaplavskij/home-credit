<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the dashboard with the user's real progress.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $property = $user->property()->first();
        $documentsCount = $user->documents()->count();

        return Inertia::render('dashboard', [
            'userName' => $user->name,
            'hasProperty' => $property !== null,
            'documentsCount' => $documentsCount,
        ]);
    }
}
