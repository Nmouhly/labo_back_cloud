<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Conference extends Model
{
    protected $table = 'conferences';
    protected $fillable = [
        'title',
        'date',
        'location',
        'image',
    ];

}
