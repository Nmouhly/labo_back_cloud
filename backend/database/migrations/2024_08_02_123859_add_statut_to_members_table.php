<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatutToMembersTable extends Migration
{
    public function up()
    {
        Schema::table('members', function (Blueprint $table) {
            $table->string('statut')->nullable(); // Ajoutez la colonne statut
        });
    }

    public function down()
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn('statut'); // Supprimez la colonne statut si nécessaire
        });
    }
}
