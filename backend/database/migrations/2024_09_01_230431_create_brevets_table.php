<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBrevetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('brevets', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('author');
            $table->string('doi');
            $table->string('id_user'); // IDs des utilisateurs sous forme de chaîne
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('brevets');
    }
}
