<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Revue;
use App\User;
class RevueController extends Controller
{
    public function index()
    {
        // Récupère toutes les revues
        return response()->json(Revue::all());
    }
    public function getRevuesByUserOrContributor($id_user)
    {
        // Récupérer les ouvrages où id_user est l'utilisateur ou où il est dans une chaîne de IDs (contributeurs)
        $ouvrages = Revue::where('id_user', $id_user)
            ->orWhere('id_user', 'like', '%' . $id_user . '%')
            ->get();

        return response()->json($ouvrages);
    }
    public function showUser($id)
    {
        $brevet = Revue::find($id);
        if ($brevet) {
            // Séparez les auteurs avec et sans ID
            $authorNames = explode(', ', $brevet->author);
            $authorIds = explode(',', $brevet->id_user);

            $authorsWithIds = [];
            $authorsWithoutIds = [];

            foreach ($authorNames as $index => $name) {
                if (isset($authorIds[$index]) && !empty($authorIds[$index])) {
                    $authorsWithIds[] = $name;
                } else {
                    $authorsWithoutIds[] = $name;
                }
            }

            return response()->json([
                'title' => $brevet->title,
                'doi' => $brevet->DOI, // Changer en minuscules pour correspondre au frontend
                'authors_with_ids' => $authorsWithIds,
                'author_ids' => $authorIds,
                'authors_without_ids' => $authorsWithoutIds
            ]);
        } else {
            return response()->json(['message' => 'Revue not found'], 404);
        }
    }


    public function storeUser(Request $request)
    {
        // Valider les données du formulaire
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'DOI' => 'required|string|max:255',
            'id_user' => 'required|exists:users,id', // Vérifier que l'utilisateur existe
        ]);
    
        // Trouver l'utilisateur par son id
        $user = User::find($request->id_user);
    
        // Vérifier si l'utilisateur a l'Etat "approuvé"
        $status = ($user->Etat === 'approuve') ? 'approuvé' : 'en attente';
    
        // Créer une nouvelle revue avec le statut déterminé
        $revue = Revue::create([
            'title' => $request->title,
            'author' => $request->author,
            'DOI' => $request->DOI,
            'id_user' => $request->id_user,
            'status' => $status, // Statut défini en fonction de l'Etat de l'utilisateur
        ]);
    
        // Retourner une réponse JSON avec un message de succès
        return response()->json(['message' => 'Revue soumise pour approbation avec succès!', 'revue' => $revue], 201);
    }
    
    public function storeAdmin(Request $request)
    {
        // Valider les données du formulaire
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'DOI' => 'required|string|max:255',
            'id_user' => 'string|max:255', // Valider que id_user est présent dans la table members
        ]);

        // Créer un nouvel ouvrage avec le statut "en attente"
        $ouvrage = Revue::create([
            'title' => $request->title,
            'author' => $request->author,
            'DOI' => $request->DOI,
            'id_user' => $request->id_user,
            'status' => 'approuvé', // Statut par défaut
        ]);

        // Retourner une réponse JSON avec un message de succès
        return response()->json(['message' => 'Ouvrage soumis pour approbation avec succès!', 'ouvrage' => $ouvrage], 201);
    }


    public function show($id)
    {
        // Trouve la revue par ID
        $revue = Revue::find($id);

        if ($revue) {
            return response()->json($revue);
        }

        return response()->json(['message' => 'Revue non trouvée'], 404);
    }
    public function updateRevues(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'DOI' => 'required|string|max:255',
            'current_user_id' => 'required|integer',
            'author_names' => 'array',
            'id_user' => 'string', // IDs des auteurs
            'optional_authors' => 'array',
        ]);

        try {
            $revue = Revue::findOrFail($id);

            $title = $request->input('title');
            $DOI = $request->input('DOI');
            $authorNames = $request->input('author_names', []);
            $authorIds = explode(',', $request->input('id_user', '')); // IDs des auteurs
            $optionalAuthors = $request->input('optional_authors', []);

            // Préparer les auteurs et IDs
            $finalAuthorNames = [];
            $finalAuthorIds = [];

            foreach ($authorNames as $index => $name) {
                // Vérifier si l'ID existe pour cet auteur
                if (isset($authorIds[$index]) && !empty($authorIds[$index])) {
                    $finalAuthorNames[] = $name;
                    $finalAuthorIds[] = $authorIds[$index];
                } else {
                    // Ajouter les noms sans ID
                    $finalAuthorNames[] = $name;
                }
            }

            // Mettre à jour les valeurs
            $revue->title = $title;
            $revue->author = implode(', ', $finalAuthorNames);
            $revue->DOI = $DOI;
            $revue->id_user = implode(',', $finalAuthorIds);

            // Mettre le statut à "en attente" lors de la modification
            $revue->status = 'en attente';

            $revue->save();

            return response()->json(['message' => 'Revue mise à jour avec succès']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la mise à jour de la revue', 'error' => $e->getMessage()], 500);
        }
    }
    public function updateRevuesAdmin(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'DOI' => 'required|string|max:255',
            'current_user_id' => 'required|integer',
            'author_names' => 'array',
            'id_user' => 'string', // IDs des auteurs
            'optional_authors' => 'array',
        ]);

        try {
            $revue = Revue::findOrFail($id);

            $title = $request->input('title');
            $DOI = $request->input('DOI');
            $authorNames = $request->input('author_names', []);
            $authorIds = explode(',', $request->input('id_user', '')); // IDs des auteurs
            $optionalAuthors = $request->input('optional_authors', []);

            // Préparer les auteurs et IDs
            $finalAuthorNames = [];
            $finalAuthorIds = [];

            foreach ($authorNames as $index => $name) {
                // Vérifier si l'ID existe pour cet auteur
                if (isset($authorIds[$index]) && !empty($authorIds[$index])) {
                    $finalAuthorNames[] = $name;
                    $finalAuthorIds[] = $authorIds[$index];
                } else {
                    // Ajouter les noms sans ID
                    $finalAuthorNames[] = $name;
                }
            }

            // Mettre à jour les valeurs
            $revue->title = $title;
            $revue->author = implode(', ', $finalAuthorNames);
            $revue->DOI = $DOI;
            $revue->id_user = implode(',', $finalAuthorIds);

            $revue->status = 'approuvé';

            $revue->save();

            return response()->json(['message' => 'Revue mise à jour avec succès']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la mise à jour de la revue', 'error' => $e->getMessage()], 500);
        }
    }


    public function destroy($id)
    {
        // Trouve la revue par ID
        $revue = Revue::find($id);

        if ($revue) {
            // Supprime la revue
            $revue->delete();

            return response()->json(['message' => 'Revue supprimée']);
        }

        return response()->json(['message' => 'Revue non trouvée'], 404);
    }

    // Exemple dans Laravel (Contrôleur RevueController)
    // Exemple dans Laravel (Contrôleur RevueController)
    public function checkDOIExists(Request $request)
    {
        $doi = $request->input('doi');
        $exists = Revue::where('DOI', $doi)->exists(); // Revue est le modèle pour votre table des revues

        return response()->json(['exists' => $exists]);
    }
    // Méthode pour accepter une revue
    public function acceptRevue($id)
    {
        $revue = Revue::findOrFail($id);
        $revue->status = 'approuvé'; // Change le statut à 'approuvé'
        $revue->save();

        return response()->json(['message' => 'Revue acceptée avec succès!', 'revue' => $revue]);
    }

    // Méthode pour rejeter une revue
    public function rejectRevue($id)
    {
        $revue = Revue::findOrFail($id);
        $revue->status = 'rejeté'; // Change status to 'rejeté'
        $revue->save();

        return response()->json(['message' => 'Revue rejetée avec succès!', 'revues' => $revue]);
    }

    public function getRevuesEnAttente()
    {
        $revues = Revue::where('status', 'en attente')->get();
        return response()->json($revues);
    }

    public function getRevuesAcceptes()
    {
        // Récupérer les revues avec le statut 'approuvé'
        $revues = Revue::where('status', 'approuvé')->get();

        // Retourner les revues acceptées en JSON
        return response()->json($revues);
    }

}
