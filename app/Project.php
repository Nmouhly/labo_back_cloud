<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{protected $table = 'projects';
    protected $fillable = [
        'title',
        'description',
        'team',
        'start_date',
        'end_date',
        'funding_type',
        'status'
    ];
}
