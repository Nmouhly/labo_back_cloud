<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSeminarsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::create('seminars', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('description');
        $table->date('date');
        $table->time('start_time');
        $table->time('end_time');
        $table->string('location');
        $table->string('speaker');
        $table->string('status'); // statut du séminaire
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
        Schema::dropIfExists('seminars');
    }
}
