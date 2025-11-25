<?php

namespace App\Http\Controllers;
use App\Habilitation;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HabilitationController extends Controller
{
    // Afficher la liste des habilitations
    public function index()
    {
        $habilitations = Habilitation::all();
        return response()->json($habilitations);
    }

    // Afficher un habilitation spécifique
    public function show($id)
    {
        $habilitation = Habilitation::findOrFail($id);
        return response()->json($habilitation);
    }

    // Créer une nouvelle habilitation
    // public function store(Request $request)
    // {
    //     $validatedData = $request->validate([
    //         'title' => 'required|string|max:255',
    //         'author' => 'required|string',
    //         'doi' => 'nullable|string|max:255',
    //         'id_user' => 'required|string',
    //         'lieu' => 'nullable|string|max:255',
    //         'date' => 'nullable|date',
    //     ]);

    //     try {
    //         $habilitation = Habilitation::create([
    //             'title' => $validatedData['title'],
    //             'author' => $validatedData['author'],
    //             'doi' => $validatedData['doi'],
    //             'id_user' => $validatedData['id_user'],
    //             'lieu' => $validatedData['lieu'],
    //             'date' => $validatedData['date'],
    //             'status' => 'en attente', // Statut par défaut

    //         ]);

    //         return response()->json($habilitation, 201);
    //     } catch (\Exception $e) {
    //         return response()->json(['error' => 'Erreur lors de l\'ajout habilitation'], 500);
    //     }
    // }
    
    public function store(Request $request)
{
    // Valider les données du formulaire
    $request->validate([
        'title' => 'required|string|max:255',
        'author' => 'required|string|max:255',
        'doi' => 'required|string|max:255',
        'id_user' => 'required|exists:users,id', // Vérifier que l'utilisateur existe
        'lieu' => 'nullable|string|max:255',
        'date' => 'nullable|date',
    ]);

    // Trouver l'utilisateur par son id
    $user = User::find($request->id_user);

    // Vérifier si l'utilisateur a l'Etat "approuvé"
    $status = ($user->Etat === 'approuve') ? 'approuvé' : 'en attente';

    // Créer une nouvelle habilitation avec le statut déterminé
    $habilitation = Habilitation::create([
        'title' => $request->title,
        'author' => $request->author,
        'doi' => $request->doi,
        'id_user' => $request->id_user,
        'lieu' => $request->lieu,
        'date' => $request->date,
        'status' => $status, // Statut défini en fonction de l'Etat de l'utilisateur
    ]);

    // Retourner une réponse JSON avec un message de succès
    return response()->json(['message' => 'Habilitation soumise pour approbation avec succès!', 'habilitation' => $habilitation], 201);
}

    public function storeAdmin(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string',
            'doi' => 'nullable|string|max:255',
            'id_user' => 'required|string',
            'lieu' => 'nullable|string|max:255',
            'date' => 'nullable|date',
        ]);

        try {
            $habilitation = Habilitation::create([
                'title' => $validatedData['title'],
                'author' => $validatedData['author'],
                'doi' => $validatedData['doi'],
                'id_user' => $validatedData['id_user'],
                'lieu' => $validatedData['lieu'],
                'date' => $validatedData['date'],
                'status' => 'approuvé', // Statut par défaut

            ]);

            return response()->json($habilitation, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de l\'ajout habilitation'], 500);
        }
    }

    public function getByUser($id_user)
    {
        // Récupérer les ouvrages associés à l'id_user spécifié
        $habilitation = Habilitation::where('id_user', $id_user)->get();


        // Retourner les ouvrages trouvés
        return response()->json($habilitation);
    }
    public function getHabilitationByUserOrContributor($id_user)
    {
        // Récupérer les ouvrages où id_user est l'utilisateur ou où il est dans une chaîne de IDs (contributeurs)
        $habilitations = Habilitation::where('id_user', $id_user)
            ->orWhere('id_user', 'like', '%' . $id_user . '%')
            ->get();

        return response()->json($habilitations);
    }
    // Mettre à jour une habilitation existante

    // Supprimer une habilitation
    public function destroy($id)
    {
        $habilitation = Habilitation::findOrFail($id);
        $habilitation->delete();
        return response()->json(null, 204);
    }
    public function checkDOIExists(Request $request)
    {
        $doi = $request->input('doi');
        $exists = Habilitation::where('DOI', $doi)->exists(); // Revue est le modèle pour votre table des revues

        return response()->json(['exists' => $exists]);
    }
    public function rejectHabilitation($id)
    {
        $habilitation = Habilitation::findOrFail($id);
        $habilitation->status = 'rejeté'; // Change status to 'rejeté'
        $habilitation->save();

        return response()->json(['message' => 'Habilitation rejetée avec succès!', 'habilitation' => $habilitation]);
    }

    public function getPendingHabilitations()
    {
        $habilitations = Habilitation::where('status', 'en attente')->get();
        return response()->json($habilitations);
    }

    public function getAcceptedHabilitations()
    {
        $habilitations = Habilitation::where('status', 'approuvé')->get();
        return response()->json($habilitations);
    }

    public function acceptHabilitation($id)
    {
        $habilitation = Habilitation::findOrFail($id);
        $habilitation->status = 'approuvé'; // Change status to 'approuvé'
        $habilitation->save();

        return response()->json(['message' => 'Habilitation acceptée avec succès!', 'habilitation' => $habilitation]);
    }
    public function showUser($id)
    {
        // Récupérer l'habilitation par ID
        $habilitation = Habilitation::find($id);

        if ($habilitation) {
            // Séparez les auteurs avec et sans ID
            $authorNames = explode(',', str_replace(', ', ',', $habilitation->author)); // Normalize spaces
            $authorIds = explode(',', $habilitation->id_user);

            $authorsWithIds = [];
            $authorsWithoutIds = [];

            // Check for matching number of authors and ids
            foreach ($authorNames as $index => $name) {
                $name = trim($name); // Remove any extra spaces

                if (isset($authorIds[$index]) && !empty($authorIds[$index])) {
                    $authorsWithIds[] = $name;
                } else {
                    $authorsWithoutIds[] = $name;
                }
            }

            return response()->json([
                'title' => $habilitation->title,
                'doi' => strtolower($habilitation->doi), // Ensure DOI is lowercase
                'authors_with_ids' => $authorsWithIds,
                'author_ids' => array_filter($authorIds), // Remove empty IDs
                'authors_without_ids' => $authorsWithoutIds,
                'date' => $habilitation->date,
                'lieu' => $habilitation->lieu,
            ]);
        } else {
            return response()->json(['message' => 'Habilitation not found'], 404);
        }
    }
    public function updateHabilitation(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'doi' => 'required|string|max:255',  // Assurez-vous que 'doi' est en minuscule
            'current_user_id' => 'required|integer',
            'author_names' => 'array',
            'id_user' => 'string', // IDs des auteurs
            'optional_authors' => 'array',
            'lieu' => 'required|string|max:255', // Lieu de soutenance
            'date' => 'required|date', // Date de soutenance
        ]);

        try {
            $habilitation = Habilitation::findOrFail($id);

            // Récupérer les champs du formulaire
            $title = $request->input('title');
            $doi = $request->input('doi');  // Assurez-vous d'utiliser 'doi' en minuscule
            $lieu = $request->input('lieu');
            $date = $request->input('date');
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

            // Mettre à jour les valeurs de l'habilitation
            $habilitation->title = $title;
            $habilitation->author = implode(', ', $finalAuthorNames);
            $habilitation->doi = $doi;  // Assurez-vous d'utiliser 'doi' en minuscule
            $habilitation->id_user = implode(',', $finalAuthorIds); // S'assurer que les IDs sont corrects
            $habilitation->lieu = $lieu;
            $habilitation->date = $date;
            $habilitation->status = 'approuvé';

            // Sauvegarder les modifications
            $habilitation->save();

            return response()->json(['message' => 'Habilitation mise à jour avec succès']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la mise à jour de l\'habilitation', 'error' => $e->getMessage()], 500);
        }
    }
    public function updateHabilitationAdmin(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'doi' => 'required|string|max:255',  // Assurez-vous que 'doi' est en minuscule
            'current_user_id' => 'required|integer',
            'author_names' => 'array',
            'id_user' => 'string', // IDs des auteurs
            'optional_authors' => 'array',
            'lieu' => 'required|string|max:255', // Lieu de soutenance
            'date' => 'required|date', // Date de soutenance
        ]);

        try {
            $habilitation = Habilitation::findOrFail($id);

            // Récupérer les champs du formulaire
            $title = $request->input('title');
            $doi = $request->input('doi');  // Assurez-vous d'utiliser 'doi' en minuscule
            $lieu = $request->input('lieu');
            $date = $request->input('date');
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

            // Mettre à jour les valeurs de l'habilitation
            $habilitation->title = $title;
            $habilitation->author = implode(', ', $finalAuthorNames);
            $habilitation->doi = $doi;  // Assurez-vous d'utiliser 'doi' en minuscule
            $habilitation->id_user = implode(',', $finalAuthorIds); // S'assurer que les IDs sont corrects
            $habilitation->lieu = $lieu;
            $habilitation->date = $date;
            $habilitation->status = 'en attente';

            // Sauvegarder les modifications
            $habilitation->save();

            return response()->json(['message' => 'Habilitation mise à jour avec succès']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la mise à jour de l\'habilitation', 'error' => $e->getMessage()], 500);
        }
    }
}
