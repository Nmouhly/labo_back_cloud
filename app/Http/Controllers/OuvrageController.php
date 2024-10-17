<?php

namespace App\Http\Controllers;
use App\Ouvrage;
use App\User;
use Illuminate\Http\Request;

class OuvrageController extends Controller
{

    public function showUser($id)
    {
        $ouvrage = Ouvrage::find($id);
        if ($ouvrage) {
            // Séparez les auteurs avec et sans ID
            $authorNames = explode(', ', $ouvrage->author);
            $authorIds = explode(',', $ouvrage->id_user);

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
                'title' => $ouvrage->title,
                'doi' => $ouvrage->DOI, // Changer en minuscules pour correspondre au frontend
                'authors_with_ids' => $authorsWithIds,
                'author_ids' => $authorIds,
                'authors_without_ids' => $authorsWithoutIds
            ]);
        } else {
            return response()->json(['message' => 'Ouvrage not found'], 404);
        }
    }

    public function store(Request $request)
    {
        // Valider les données du formulaire
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'DOI' => 'required|string|max:255',
            'id_user' => 'string|max:255', // Valider que id_user est présent dans la table members
        ]);

        // Créer un nouvel ouvrage avec les données validées, en définissant le statut par défaut
        $ouvrage = Ouvrage::create([
            'title' => $request->title,
            'author' => $request->author,
            'DOI' => $request->DOI,
            'id_user' => $request->id_user, // Ajoutez cette ligne pour inclure id_user
            'status' => 'approuvé', // Définit le statut par défaut sur "pending"
        ]);

        // Retourner une réponse JSON avec un message de succès
        return response()->json(['message' => 'Ouvrage créé avec succès!', 'ouvrage' => $ouvrage], 201);
    }

    // public function storeUser(Request $request)
    // {
    //     // Valider les données du formulaire
    //     $request->validate([
    //         'title' => 'required|string|max:255',
    //         'author' => 'required|string|max:255',
    //         'DOI' => 'required|string|max:255',
    //         'id_user' => 'string|max:255', // Valider que id_user est présent dans la table members
    //     ]);

    //     // Créer un nouvel ouvrage avec le statut "en attente"
    //     $ouvrage = Ouvrage::create([
    //         'title' => $request->title,
    //         'author' => $request->author,
    //         'DOI' => $request->DOI,
    //         'id_user' => $request->id_user,
    //         'status' => 'en attente', // Statut par défaut
    //     ]);

    //     // Retourner une réponse JSON avec un message de succès
    //     return response()->json(['message' => 'Ouvrage soumis pour approbation avec succès!', 'ouvrage' => $ouvrage], 201);
    // }

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
    
        // Créer un nouvel ouvrage avec le statut déterminé
        $ouvrage = Ouvrage::create([
            'title' => $request->title,
            'author' => $request->author,
            'DOI' => $request->DOI,
            'id_user' => $request->id_user,
            'status' => $status, // Statut défini en fonction de l'Etat de l'utilisateur
        ]);
    
        // Retourner une réponse JSON avec un message de succès
        return response()->json(['message' => 'Ouvrage soumis pour approbation avec succès!', 'ouvrage' => $ouvrage], 201);
    }
    
    public function getOuvragesByUserOrContributor($id_user)
    {
        // Récupérer les ouvrages où id_user est l'utilisateur ou où il est dans une chaîne de IDs (contributeurs)
        $ouvrages = Ouvrage::where('id_user', $id_user)
            ->orWhere('id_user', 'like', '%' . $id_user . '%')
            ->get();

        return response()->json($ouvrages);
    }
    public function updateOuvrage(Request $request, $id)
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
            $ouvrage = Ouvrage::findOrFail($id);

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
            $ouvrage->title = $title;
            $ouvrage->author = implode(', ', $finalAuthorNames);
            $ouvrage->DOI = $DOI;
            $ouvrage->id_user = implode(',', $finalAuthorIds); // Assurez-vous que les IDs sont corrects
            $ouvrage->status = 'en attente';

            $ouvrage->save();

            return response()->json(['message' => 'Ouvrage updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating ouvrage', 'error' => $e->getMessage()], 500);
        }
    }
    public function updateOuvrageAdmin(Request $request, $id)
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
            $ouvrage = Ouvrage::findOrFail($id);

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
            $ouvrage->title = $title;
            $ouvrage->author = implode(', ', $finalAuthorNames);
            $ouvrage->DOI = $DOI;
            $ouvrage->id_user = implode(',', $finalAuthorIds); // Assurez-vous que les IDs sont corrects
            $ouvrage->status = 'approuvé';

            $ouvrage->save();

            return response()->json(['message' => 'Ouvrage updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating ouvrage', 'error' => $e->getMessage()], 500);
        }
    }


    public function getByUser($id_user)
    {
        // Récupérer les ouvrages associés à l'id_user spécifié
        $ouvrages = Ouvrage::where('id_user', $id_user)->get();


        // Retourner les ouvrages trouvés
        return response()->json($ouvrages);
    }
    public function destroy($id)
    {
        $ouvrage = Ouvrage::find($id);
        if ($ouvrage) {
            $ouvrage->delete();
            return response()->json(['message' => 'Ouvrage supprimé']);
        }
        return response()->json(['message' => 'Ouvrage non trouvé'], 404);
    }
    public function checkDOIExist(Request $request)
    {
        $doi = $request->input('DOI');
        $exists = Ouvrage::where('DOI', $doi)->exists(); // Revue est le modèle pour votre table des revues

        return response()->json(['exists' => $exists]);
    }
   
    public function acceptOuvrage($id)
    {
        $ouvrage = Ouvrage::findOrFail($id);
        $ouvrage->status = 'approuvé'; // Change le statut à 'approuvé'
        $ouvrage->save();

        return response()->json(['message' => 'Ouvrage accepté avec succès!', 'ouvrage' => $ouvrage]);
    }




    // Méthode pour rejeter un ouvrage
    public function rejectOuvrage($id)
    {
        $ouvrage = Ouvrage::findOrFail($id);
        $ouvrage->status = 'rejeté'; // Change status to 'rejeté'
        $ouvrage->save();

        return response()->json(['message' => 'Ouvrage rejetée avec succès!', 'ouvrages' => $ouvrage]);
    }


    public function getPublicationsEnAttente()
    {
        $ouvrages = Ouvrage::where('status', 'en attente')->get();
        return response()->json($ouvrages);
    }

    public function getOuvragesByAdminOrContributor($id_user)
    {
        // Récupérer les ouvrages où l'utilisateur est soit l'auteur principal soit contributeur
        $ouvrages = Ouvrage::where('id_user', $id_user)
            ->orWhere('author_ids', 'like', '%' . $id_user . '%') // Assurez-vous que 'author_ids' est une chaîne contenant les ID des contributeurs.
            ->get();

        return response()->json($ouvrages);
    }

    public function getOuvragesAcceptes()
    {
        // Récupérer les ouvrages avec le statut 'accepté'
        $ouvrages = Ouvrage::where('status', 'approuvé')->get();

        // Retourner les ouvrages acceptés en JSON
        return response()->json($ouvrages);
    }


}
