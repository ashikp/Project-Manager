<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPanelController extends Controller
{
    

    public function index()
    {
        return Inertia::render('AdminPanel/Index');
    }
}
