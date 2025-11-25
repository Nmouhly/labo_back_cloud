<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLaboratoireTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('laboratoire', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->text('description')->nullable();
            $table->string('adresse')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_telephone')->nullable();
            $table->string('site_web')->nullable();
            $table->date('date_fondation')->nullable();
            $table->string('logo')->nullable();
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
        Schema::dropIfExists('laboratoire');
    }
}
