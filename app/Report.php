<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;
class Report extends Model
{
    protected $table = 'rapports';
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
}
