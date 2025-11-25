<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;
class Ouvrage extends Model
{
    protected $table = 'ouvrages';
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
    // public function member()
    // {
    //     return $this->belongsTo(Member::class, 'id_user', 'user_id');
    // }

}

