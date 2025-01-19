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
            $table->string('token', 128)->nullable()->after('education'); // Add 'token' column after 'education'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_regestrations', function (Blueprint $table) {
            $table->dropColumn('token'); // Drop 'token' column on rollback
        });
    }
};
