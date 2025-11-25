<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = ['sender_id', 'receiver_id', 'message', 'read'];

    // Relation avec le modèle User
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}