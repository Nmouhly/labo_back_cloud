<?php

namespace App\Http\Controllers;
use App\Brevet;
use Illuminate\Http\Request;
use App\User;

class BrevetController extends Controller
{


    // Ajouter un nouveau brevet
    // public function storeUser(Request $request)
    // {
    //     // Valider les données du formulaire
    //     $request->validate([
    //         'title' => 'required|string|max:255',
    //         'author' => 'required|string|max:255',
    //         'doi' => 'required|string|max:255',
    //         'id_user' => 'string|max:255', // Valider que id_user est présent dans la table members
    //     ]);

    //     // Créer un nouvel ouvrage avec les données validées
    //     $brevets = Brevet::create([
    //         'title' => $request->title,
    //         'author' => $request->author,
    //         'doi' => $request->doi,
    //         'id_user' => $request->id_user, // Ajoutez cette ligne pour inclure id_user
    //         'status' => 'en attente', // Statut par défaut

    //     ]);

    //     // Retourner une réponse JSON avec un message de succès
    //     return response()->json(['message' => 'Brevet créé avec succès!', 'brevet' => $brevets], 201);
    // }
    public function storeUser(Request $request)
{
    // Valider les données du formulaire
    $request->validate([
        'title' => 'required|string|max:255',
        'author' => 'required|string|max:255',
        'doi' => 'required|string|max:255',
        'id_user' => 'required|exists:users,id', // Vérifier que l'utilisateur existe
    ]);

    // Trouver l'utilisateur par son id
    $user = User::find($request->id_user);

    // Vérifier si l'utilisateur a l'Etat "approuvé"
    $status = ($user->Etat === 'approuve') ? 'approuvé' : 'en attente';

    // Créer un nouveau brevet avec le statut déterminé
    $brevets = Brevet::create([
        'title' => $request->title,
        'author' => $request->author,
        'doi' => $request->doi,
        'id_user' => $request->id_user,
        'status' => $status, // Statut défini en fonction de l'Etat de l'utilisateur
    ]);

    // Retourner une réponse JSON avec un message de succès
    return response()->json(['message' => 'Brevet soumis avec succès!', 'brevet' => $brevets], 201);
}

    // public function store(Request $request)
    // {
    //     // Valider les données du formulaire
    //     $request->validate([
    //         'title' => 'required|string|max:255',
    //         'author' => 'required|string|max:255',
    //         'doi' => 'required|string|max:255',
    //         'id_user' => 'string|max:255', // Valider que id_user est présent dans la table members
    //     ]);

    //     // Créer un nouvel ouvrage avec les données validées
    //     $brevets = Brevet::create([
    //         'title' => $request->title,
    //         'author' => $request->author,
    //         'doi' => $request->doi,
    //         'id_user' => $request->id_user, // Ajoutez cette ligne pour inclure id_user
    //         'status' => 'approuvé',
    //     ]);

    //     // Retourner une réponse JSON avec un message de succès
    //     return response()->json(['message' => 'Brevet créé avec succès!', 'brevet' => $brevets], 201);
    // }
    public function store(Request $request)
    {
        // Valider les données du formulaire
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'doi' => 'required|string|max:255',
            'id_user' => 'required|exists:users,id', // Vérifier que l'utilisateur existe
        ]);
    
        try {
            // Trouver l'utilisateur par son id
            $user = User::find($validatedData['id_user']);
    
            // Vérifier si l'utilisateur a l'Etat "approuvé"
            $status = ($user->Etat === 'approuve') ? 'approuvé' : 'en attente';
    
            // Créer un nouveau brevet avec le statut déterminé
            $brevets = Brevet::create([
                'title' => $validatedData['title'],
                'author' => $validatedData['author'],
                'doi' => $validatedData['doi'],
                'id_user' => $validatedData['id_user'],
                'status' => $status, // Statut défini en fonction de l'Etat de l'utilisateur
            ]);
    
            // Retourner une réponse JSON avec un message de succès
            return response()->json(['message' => 'Brevet créé avec succès!', 'brevet' => $brevets], 201);
        } catch (\Exception $e) {
            // Gérer les erreurs et retourner une réponse JSON
            return response()->json(['error' => 'Erreur lors de la création du brevet'], 500);
        }
    }
    

    // Afficher un brevet spécifique
    public function show($id)
    {
        $brevet = Brevet::find($id);

        if ($brevet) {
            return response()->json($brevet);
        }

        return response()->json(['message' => 'Brevet non trouvé'], 404);
    }

    // Mettre à jour un brevet existant
    public function updateBrevet(Request $request, $id)
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
            $brevet = Brevet::findOrFail($id);

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
            $brevet->title = $title;
            $brevet->author = implode(', ', $finalAuthorNames);
            $brevet->doi = $DOI;
            $brevet->id_user = implode(',', $finalAuthorIds); // Assurez-vous que les IDs sont corrects
            $brevet->status = 'en attente';

            $brevet->save();

            return response()->json(['message' => 'Brevet mis à jour avec succès']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la mise à jour du brevet', 'error' => $e->getMessage()], 500);
        }
    }
    public function updateBrevetAdmin(Request $request, $id)
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
            $brevet = Brevet::findOrFail($id);

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
            $brevet->title = $title;
            $brevet->author = implode(', ', $finalAuthorNames);
            $brevet->doi = $DOI;
            $brevet->id_user = implode(',', $finalAuthorIds); // Assurez-vous que les IDs sont corrects
            $brevet->status = 'approuvé';

            $brevet->save();

            return response()->json(['message' => 'Brevet mis à jour avec succès']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la mise à jour du brevet', 'error' => $e->getMessage()], 500);
        }
    }

    public function getByUser($id_user)
    {
        // Récupérer les ouvrages associés à l'id_user spécifié
        $brevets = Brevet::where('id_user', $id_user)->get();


        // Retourner les ouvrages trouvés
        return response()->json($brevets);
    }
    // Supprimer un brevet
    public function destroy($id)
    {
        $brevet = Brevet::find($id);
        if ($brevet) {
            $brevet->delete();
            return response()->json(['message' => 'Brevet supprimé']);
        }
        return response()->json(['message' => 'Brevet non trouvé'], 404);
    }

    public function getBrevetByUserOrContributor($id_user)
    {
        // Récupérer les ouvrages où id_user est l'utilisateur ou où il est dans une chaîne de IDs (contributeurs)
        $ouvrages = Brevet::where('id_user', $id_user)
            ->orWhere('id_user', 'like', '%' . $id_user . '%')
            ->get();

        return response()->json($ouvrages);
    }
    public function checkDOIExists(Request $request)
    {
        $doi = $request->input('doi');
        $exists = Brevet::where('doi', $doi)->exists(); // Revue est le modèle pour votre table des revues

        return response()->json(['exists' => $exists]);
    }
    public function showUser($id)
    {
        $brevet = Brevet::find($id);
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
                'doi' => $brevet->doi, // Assurez-vous que le champ est en minuscules pour correspondre au frontend
                'authors_with_ids' => $authorsWithIds,
                'author_ids' => $authorIds,
                'authors_without_ids' => $authorsWithoutIds
            ]);
        } else {
            return response()->json(['message' => 'Brevet not found'], 404);
        }
    }
    public function rejectBrevet($id)
    {
        $brevet = Brevet::findOrFail($id);
        $brevet->status = 'rejeté'; // Change le statut à 'rejeté'
        $brevet->save();

        return response()->json(['message' => 'Brevet rejeté avec succès!', 'brevet' => $brevet]);
    }
    public function getBrevetsEnAttente()
    {
        $brevets = Brevet::where('status', 'en attente')->get();
        return response()->json($brevets);
    }
    public function getBrevetsAcceptes()
    {
        $brevets = Brevet::where('status', 'approuvé')->get();
        return response()->json($brevets);
    }

    public function acceptBrevet($id)
    {
        $brevet = Brevet::findOrFail($id);
        $brevet->status = 'approuvé'; // Change le statut à 'approuvé'
        $brevet->save();

        return response()->json(['message' => 'Brevet accepté avec succès!', 'brevet' => $brevet]);
    }

}
