<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('original_name');
            $table->string('path');
            $table->string('type');
            $table->integer('size');
            $table->string('disk');
            $table->string('password')->nullable();
            $table->integer('version')->default(1);
            $table->foreignId('uploaded_by')->constrained('users');
            $table->morphs('fileable');
            $table->timestamps();
        });

        Schema::create('file_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('file_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->integer('version');
            $table->string('comment')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('file_versions');
        Schema::dropIfExists('files');
    }
}; 