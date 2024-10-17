<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusToBrevetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('brevets', function (Blueprint $table) {
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
        Schema::table('brevets', function (Blueprint $table) {
            // Supprime la colonne 'status' si la migration est annulée
            $table->dropColumn('status');
        });
    }
}