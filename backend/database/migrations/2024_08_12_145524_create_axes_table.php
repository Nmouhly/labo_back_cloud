<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAxesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('axes', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // Titre de l'axe
            $table->text('content'); // Contenu de l'axe
            $table->timestamps(); // Pour les colonnes created_at et updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('axes');
    }
}
