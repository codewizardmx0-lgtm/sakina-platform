<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('beneficiary')->after('email'); // beneficiary, specialist, admin
            $table->string('phone')->nullable()->after('role');
            $table->date('birth_date')->nullable()->after('phone');
            $table->boolean('is_active')->default(true)->after('birth_date');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'phone', 'birth_date', 'is_active']);
        });
    }
};
