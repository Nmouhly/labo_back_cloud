<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Patent extends Model
{
    protected $table = 'patents';
    protected $fillable = [
        'title',
        'author',
        'filing_date',
        'pdf_link',
    ];

    protected $dates = ['filing_date'];
}
