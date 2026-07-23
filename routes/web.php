<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\SyrupController;
use App\Http\Controllers\VtcController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/vtc');

Route::get('/vtc', [VtcController::class, 'index'])->name('vtc.index');
Route::post('/vtc/calcular', [VtcController::class, 'calculate'])->name('vtc.calculate');
Route::post('/vtc/enviar', [VtcController::class, 'sendEmail'])
    ->middleware('throttle:10,1')
    ->name('vtc.send');

Route::get('/formulas', [ProductController::class, 'index'])->name('formulas.index');
Route::post('/formulas', [ProductController::class, 'store'])->name('formulas.store');
Route::put('/formulas/{product}', [ProductController::class, 'update'])->name('formulas.update');
Route::delete('/formulas/{product}', [ProductController::class, 'destroy'])->name('formulas.destroy');
Route::post('/formulas/{product}/ingredients', [ProductController::class, 'storeIngredient'])->name('formulas.ingredients.store');
Route::put('/formulas/{product}/ingredients/{productIngredient}', [ProductController::class, 'updateIngredient'])->name('formulas.ingredients.update');
Route::delete('/formulas/{product}/ingredients/{productIngredient}', [ProductController::class, 'destroyIngredient'])->name('formulas.ingredients.destroy');

Route::get('/jarabes', [SyrupController::class, 'index'])->name('jarabes.index');
Route::post('/jarabes', [SyrupController::class, 'store'])->name('jarabes.store');
Route::put('/jarabes/{syrup}', [SyrupController::class, 'update'])->name('jarabes.update');
Route::delete('/jarabes/{syrup}', [SyrupController::class, 'destroy'])->name('jarabes.destroy');
Route::post('/jarabes/{syrup}/ingredients', [SyrupController::class, 'storeIngredient'])->name('jarabes.ingredients.store');
Route::put('/jarabes/{syrup}/ingredients/{syrupIngredient}', [SyrupController::class, 'updateIngredient'])->name('jarabes.ingredients.update');
Route::delete('/jarabes/{syrup}/ingredients/{syrupIngredient}', [SyrupController::class, 'destroyIngredient'])->name('jarabes.ingredients.destroy');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
