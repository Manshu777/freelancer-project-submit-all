<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('user_regestrations', function (Blueprint $table) {
            $table->text('about')->nullable(); 
            $table->json('skills')->nullable();
            $table->json('projects')->nullable();
            $table->json('education')->nullable(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {  Schema::table('user_regestrations', function (Blueprint $table) {
        $table->dropColumn(['about', 'skills', 'projects', 'education']);
    });
    }
};
