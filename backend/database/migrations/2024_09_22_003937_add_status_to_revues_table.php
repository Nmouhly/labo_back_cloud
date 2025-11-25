<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusToRevuesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('revues', function (Blueprint $table) {
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
        Schema::table('revues', function (Blueprint $table) {
            //
        });
    }
}
