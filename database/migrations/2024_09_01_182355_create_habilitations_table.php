<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHabilitationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('habilitations', function (Blueprint $table) {
            $table->id(); // Colonne id auto-incrémentée
            $table->string('title'); // Colonne titre
            $table->string('author'); // Colonne auteur
            $table->string('doi')->nullable(); // Colonne DOI, nullable si non obligatoire
            $table->string('id_user'); // Colonne id_user (varchar)
            $table->string('lieu'); // Colonne lieu
            $table->date('date'); // Colonne date
            $table->timestamps(); // Colonnes created_at et updated_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('habilitations');
    }
}
