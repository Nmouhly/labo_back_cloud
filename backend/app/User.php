<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Member; // Ensure this is the correct namespace
use App\Ouvrage;
use App\Habilitation;
use App\Brevet;
use App\These;
use App\Report;
use App\Revue;
class User extends Authenticatable
{
    use Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'bio',
        'first_login',
        'Etat',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'role' => 'integer',
    ];

    public function member()
    {
        return $this->hasOne(Member::class);
    }
    public function ouvrages()
{
    return $this->hasMany(Ouvrage::class, 'id_user');
}

public function habilitations()
{
    return $this->hasMany(Habilitation::class, 'id_user');
}

public function brevets()
{
    return $this->hasMany(Brevet::class, 'id_user');
}

public function theses()
{
    return $this->hasMany(These::class, 'id_user');
}

public function reports()
{
    return $this->hasMany(Report::class, 'id_user');
}

public function revues()
{
    return $this->hasMany(Revue::class, 'id_user');
}

    protected static function boot()
    {
        parent::boot();

        static::updated(function ($user) {
            if ($user->member) {
                $user->member->update([
                    'email' => $user->email,
                    'name' => $user->name,
                ]);
            }
        });
    }
}
