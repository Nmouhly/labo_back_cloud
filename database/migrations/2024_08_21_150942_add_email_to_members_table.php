<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddEmailToMembersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('members', function (Blueprint $table) {
            $table->string('email')->nullable()->after('contact_info');
        });
    }
    
    public function down()
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn('email');
        });
    }
}
