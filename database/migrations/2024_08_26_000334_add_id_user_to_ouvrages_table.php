<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIdUserToOuvragesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ouvrages', function (Blueprint $table) {
            $table->unsignedBigInteger('id_user')->nullable()->after('pdf_link');
            
            // Définissez la clé étrangère pour faire référence à `user_id` dans la table `members`
            $table->foreign('id_user')->references('user_id')->on('members')->onDelete('set null');
        });
    }
    
    public function down()
    {
        Schema::table('ouvrages', function (Blueprint $table) {
            // Supprimez la clé étrangère et la colonne si nécessaire
            $table->dropForeign(['id_user']);
            $table->dropColumn('id_user');
        });
    }
}
