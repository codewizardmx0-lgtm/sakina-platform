<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('consultation_requests', function (Blueprint $table) {
            $table->boolean('share_assessment')->default(false)->after('assessment_id');
            $table->text('specialist_notes')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('consultation_requests', function (Blueprint $table) {
            $table->dropColumn(['share_assessment', 'specialist_notes']);
        });
    }
};
