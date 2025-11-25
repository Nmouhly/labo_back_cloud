<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRevuesTable extends Migration
{
    public function up()
    {
        Schema::create('revues', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('author');
            $table->string('pdf_link')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('revues');
    }
}
