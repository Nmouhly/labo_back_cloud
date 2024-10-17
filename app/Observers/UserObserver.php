<?php

namespace App\Observers;

use App\User;
use App\Revue;
use App\Ouvrage;
use App\Report;
use App\These;
use App\Habilitation;
use App\Brevet;
class UserObserver
{
    public function updated(User $user)
    {
        // Vérifiez si l'état de l'utilisateur est "approuvé"
        if ($user->isDirty('Etat') && $user->Etat === 'approuve') {
            // Approuvez tous les ouvrages de l'utilisateur
            // Ouvrage::where('id_user', $user->id)->update(['status' => 'approuvé']);
            Ouvrage::where('id_user', 'like', "%{$user->id}%")->update(['status' => 'approuvé']);
              // Approuvez toutes les revues de l'utilisateur
              Revue::where('id_user', 'like', "%{$user->id}%")->update(['status' => 'approuvé']);
            
            // Approuvez tous les rapports de l'utilisateur
            Report::where('id_user', 'like', "%{$user->id}%")->update(['status' => 'approuvé']);
            
            // Approuvez toutes les thèses de l'utilisateur
            These::where('id_user', 'like', "%{$user->id}%")->update(['status' => 'approuvé']);
            
            // Approuvez toutes les habilitations de l'utilisateur
            Habilitation::where('id_user', 'like', "%{$user->id}%")->update(['status' => 'approuvé']);
            
            // Approuvez tous les brevets de l'utilisateur
            Brevet::where('id_user', 'like', "%{$user->id}%")->update(['status' => 'approuvé']);
        }
    }
}