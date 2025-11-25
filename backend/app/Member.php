<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Member extends Model
{
    protected $table = 'members';
    // Inclure 'statut' dans les attributs assignables en masse
    protected $fillable = ['name', 'position', 'team_id', 'bio', 'contact_info', 'statut', 'email','user_id', 'image'];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
    public function user()
{
    return $this->belongsTo(User::class);
}
public function ouvrages()
    {
        return $this->hasMany(Ouvrage::class, 'id_user', 'user_id');
    }
}
