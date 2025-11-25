<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;
class Habilitation extends Model
{
    protected $table = 'habilitations';

    // Attributs remplissables
    protected $fillable = [
        'title',
        'author',
        'doi',
        'id_user',
        'lieu',
        'date',
        'status',
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}
