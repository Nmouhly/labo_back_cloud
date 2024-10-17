<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class JobOffer extends Model
{
      // Définir les champs pouvant être remplis via l'assignation de masse (mass assignment)
    protected $fillable = [
        'title',
        'description',
        'requirements',
        'location',
        'salary',
        'deadline',
    ];

    // Si tu as un champ salary qui peut être null, tu peux également configurer cela ici
    protected $casts = [
        'salary' => 'decimal:2',
        'deadline' => 'date',
    ];
}
