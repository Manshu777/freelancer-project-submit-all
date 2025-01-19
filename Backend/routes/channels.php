<?php 

use Illuminate\Support\Facades\Broadcast;


Broadcast::channel('chat.{userId}.{userId2}', function ($user, $userId, $userId2) {
    return $user->id === (int) $userId || $user->id === (int) $userId2;
});;
