<?php

namespace App;
use App\User;
use Illuminate\Database\Eloquent\Model;

class Brevet extends Model
{
    // Le nom de la table associée au modèle
    protected $table = 'brevets';

    // Les attributs qui sont assignables en masse
    protected $fillable = [
        'title',
        'author',
        'doi',
        'id_user',
        'status',
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
    /**
     * Définissez une relation avec le modèle User si nécessaire.
     * Exemple d'une relation Many-to-Many ou One-to-Many (si un brevet peut avoir plusieurs utilisateurs ou un seul utilisateur).
     */
}
