<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminPanelController;
use App\Http\Controllers\PusherController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\FileManagerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserManagementController;



Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::group(['middleware' => ['role:admin']], function () {    
    Route::get('/admin', [AdminPanelController::class, 'index'])->name('admin.index');
    Route::get('/chats', [PusherController::class, 'index'])->name('chat.index');
    Route::post('/chats/boardcast', [PusherController::class, 'broadcast'])->name('chat.broadcast');
    Route::post('/chats/receive', [PusherController::class, 'recive'])->name('chat.receive');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/tasks', [TaskController::class, 'myTasks'])->name('tasks.index');
    Route::resource('projects', ProjectController::class);
    Route::get('projects/{project}/tasks', [TaskController::class, 'index'])->name('project.tasks.index');
    Route::get('projects/{project}/tasks/{task}', [TaskController::class, 'detail'])->name('project.tasks.show');
    Route::post('tasks/{task}/comments', [TaskController::class, 'addComment'])->name('tasks.comments.store');
    Route::patch('projects/{project}/tasks/{task}', [TaskController::class, 'updateDetails'])->name('tasks.update.details');
});

Route::get('/files', [FileManagerController::class, 'index'])->name('files.index');
Route::post('/files', [FileManagerController::class, 'store'])->middleware('auth')->name('files.store');
Route::get('/files/{file}/download', [FileManagerController::class, 'download'])->name('files.download');
Route::delete('/files/{file}', [FileManagerController::class, 'destroy'])->middleware('auth')->name('files.destroy');

Route::group(['middleware' => ['role:admin'], 'prefix' => 'admin', 'as' => 'admin.'], function () {    
    Route::get('/', [AdminPanelController::class, 'index'])->name('index');
    Route::resource('users', UserManagementController::class);
    Route::get('/chats', [PusherController::class, 'index'])->name('chat.index');
    Route::post('/chats/boardcast', [PusherController::class, 'broadcast'])->name('chat.broadcast');
    Route::post('/chats/receive', [PusherController::class, 'recive'])->name('chat.receive');
});

require __DIR__.'/auth.php';
