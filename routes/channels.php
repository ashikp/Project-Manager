<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('servudemo', function ($user) {
    return auth()->check();
});
