<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIdMemberToOuvragesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ouvrages', function (Blueprint $table) {
            $table->unsignedBigInteger('id_member')->nullable(); // Add the foreign key column
            $table->foreign('id_member')->references('id')->on('members')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('ouvrages', function (Blueprint $table) {
            $table->dropForeign(['id_member']);
            $table->dropColumn('id_member');
        });
    }
}
