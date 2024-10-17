<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusToHabilitationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('habilitations', function (Blueprint $table) {
            // Ajoute une colonne 'status' de type enum avec les options 'en attente', 'approuvé', 'rejeté'
            $table->enum('status', ['en attente', 'approuvé', 'rejeté'])->default('en attente');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('habilitations', function (Blueprint $table) {
            //
        });
    }
}
