<?php

// database/migrations/xxxx_xx_xx_xxxxxx_create_members_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMembersTable extends Migration
{
    public function up()
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('position');
            $table->foreignId('team_id')->constrained('teams')->onDelete('cascade');
            $table->text('bio')->nullable();
            $table->string('contact_info')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('members');
    }
}
