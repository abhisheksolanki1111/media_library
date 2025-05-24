<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MediaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {

    Route::post('logout', [AuthController::class, 'logout']);
    // Route::post('refresh', [AuthController::class, 'refresh']);
    // Route::get('me', [AuthController::class, 'me']);
    Route::get('media/expired', [MediaController::class, 'expired'])->name('media.expired');
    Route::delete('media/{id}', [MediaController::class, 'destroy'])->name('media.destroy');
    Route::get('media', [MediaController::class, 'index'])->name('media.index');
    Route::get('media/{id}', [MediaController::class, 'show'])->name('media.show');
    Route::middleware('role:uploader,admin')->post('media', [MediaController::class, 'store'])->name('media.store'); // image inversion error

   
});
