<?php

use App\Http\Controllers\UserRegestrationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\WishlistController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('/v1/user', UserRegestrationController::class);

Route::apiResource('/v1/wishlists', WishlistController::class);
Route::post('/v1/chat/send', [ChatController::class, 'sendMessage']); 
Route::get('/v1/chat/messages/{userId}', [ChatController::class, 'getMessages']); // Optional for fetching messages