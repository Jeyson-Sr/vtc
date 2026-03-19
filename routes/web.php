<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\ContactoController;



Route::inertia('/', 'vtc', )->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::post('/contacto/enviar', [ContactoController::class, 'enviarCorreo']);


require __DIR__.'/settings.php';
