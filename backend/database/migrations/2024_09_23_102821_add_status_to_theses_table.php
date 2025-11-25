<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusToThesesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('theses', function (Blueprint $table) {
            // Ajoute une colonne 'status' de type enum avec les options 'en attente', 'approuvé', 'rejeté'
            $table->enum('status', ['en attente', 'approuvé', 'rejeté'])->default('en attente');
        });
    }

    public function down()
    {
        Schema::table('theses', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }

}
