<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = ['name', 'specialization', 'description'];

    public function members()
    {
        return $this->hasMany(Member::class);
    }
}