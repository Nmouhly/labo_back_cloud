<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;
class These extends Model
{
    protected $table = 'theses';

    // Définir les attributs qui sont assignables en masse
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
    // Si vous utilisez une clé primaire non incrémentée, vous pouvez définir:
    // protected $keyType = 'string'; // Si id_user est une clé primaire non incrémentée
    // public $incrementing = false; // Si id_user n'est pas auto-incrémenté

    // Si vous avez besoin de définir des attributs cachés pour la sécurité
    // protected $hidden = [
    //     'password',
    // ];

    // Définir les types de données des attributs
    // protected $casts = [
    //     'date' => 'datetime',
    // ];
}
