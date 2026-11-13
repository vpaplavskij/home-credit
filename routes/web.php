<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\PropertyController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('my-home', [PropertyController::class, 'index'])->name('my-home');
    Route::put('my-home', [PropertyController::class, 'update'])->name('my-home.update');
    Route::get('documents', [DocumentController::class, 'index'])->name('documents.index');
    Route::post('documents/example', [DocumentController::class, 'storeExample'])->name('documents.example');
    Route::get('documents/{document}/edit', [DocumentController::class, 'edit'])->name('documents.edit');
    Route::put('documents/{document}', [DocumentController::class, 'update'])->name('documents.update');
    Route::delete('documents/{document}', [DocumentController::class, 'destroy'])->name('documents.destroy');
});

require __DIR__.'/settings.php';
