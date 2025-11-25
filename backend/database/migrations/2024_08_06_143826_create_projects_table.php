<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::create('projects', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('description');
        $table->string('team');
        $table->date('start_date');
        $table->date('end_date')->nullable();
        $table->string('funding_type');
        $table->enum('status', ['en_cours', 'termine']);
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
        Schema::dropIfExists('projects');
    }
}
