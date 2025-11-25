<?php

namespace App\Http\Controllers;
use App\Revue;
use App\Ouvrage;
use App\Project;
use App\Report;
use App\Brevet;
use App\Conference;
use App\Seminar;
use App\Member;
use Illuminate\Http\Request;

class StatisticsController extends Controller
{
  public function index()
    {
        // Comptez le nombre de revues
        $revuesCount = Revue::count();
        \Log::info("Nombre de revues : " . $revuesCount);

        // Comptez le nombre d'ouvrages
        $ouvragesCount = Ouvrage::count();
        \Log::info("Nombre d'ouvrages : " . $ouvragesCount);

        // Comptez le nombre de projets
        $projetsCount = Project::count();
        \Log::info("Nombre de projets : " . $projetsCount);

        // Comptez le nombre de rapports
        $rapportsCount = Report::count();
        \Log::info("Nombre de rapports : " . $rapportsCount);

        // Comptez le nombre de brevets
        $brevetsCount = Brevet::count();
        \Log::info("Nombre de brevets : " . $brevetsCount);

        // Comptez le nombre de conférences
        $conferencesCount = Conference::count();
        \Log::info("Nombre de conférences : " . $conferencesCount);

        // Comptez le nombre de séminaires
        $seminairesCount = Seminar::count();
        \Log::info("Nombre de séminaires : " . $seminairesCount);

        $membersCount = Member::count();
        \Log::info("Nombre de membres : " . $membersCount);

        // Retournez les statistiques sous forme de JSON
        return response()->json([
            'revues' => $revuesCount,
            'ouvrages' => $ouvragesCount,
            'projets' => $projetsCount,
            'rapports' => $rapportsCount,
            'brevets' => $brevetsCount,
            'conferences' => $conferencesCount,
            'seminaires' => $seminairesCount,
            'members' => $membersCount,


    ]);
}
  
}
