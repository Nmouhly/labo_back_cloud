<?php

namespace App;
use App\User;
use Illuminate\Database\Eloquent\Model;

class Revue extends Model
{
    protected $table = 'revues';
    protected $fillable = [
        'title',
        'author',
        'DOI',
        'id_user',
        'status',

    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
    // Définissez les règles de validation des attributs de date, si nécessaire

}
