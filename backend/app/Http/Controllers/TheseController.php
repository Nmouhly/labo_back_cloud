<?php

namespace App\Http\Controllers;
use App\These;
use App\User;
use Illuminate\Http\Request;

class TheseController extends Controller
{
    public function index()
    {
        $theses = These::all();
        return response()->json($theses);
    }

    /**
     * Show the form for creating a new thesis.
     *
     * @return \Illuminate\Http\Response
     */

    /**
     * Store a newly created thesis in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
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
    //         // Utilisation du modèle 'These'
    //         $these = These::create([
    //             'title' => $validatedData['title'],
    //             'author' => $validatedData['author'],
    //             'doi' => $validatedData['doi'],
    //             'id_user' => $validatedData['id_user'],
    //             'lieu' => $validatedData['lieu'],
    //             'date' => $validatedData['date'],
    //             'status' => 'en attente', // Statut par défaut

    //         ]);

    //         return response()->json($these, 201);
    //     } catch (\Exception $e) {
    //         return response()->json(['error' => 'Erreur lors de l\'ajout de la thèse'], 500);
    //     }
    // }
    public function store(Request $request)
    {
        // Valider les données du formulaire
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'doi' => 'nullable|string|max:255',
            'id_user' => 'required|exists:users,id', // Vérifier que l'utilisateur existe
            'lieu' => 'nullable|string|max:255',
            'date' => 'nullable|date',
        ]);
    
        // Trouver l'utilisateur par son id
        $user = User::find($request->id_user);
    
        // Vérifier si l'utilisateur a l'Etat "approuvé"
        $status = ($user->Etat === 'approuve') ? 'approuvé' : 'en attente';
    
        // Créer une nouvelle thèse avec le statut déterminé
        $these = These::create([
            'title' => $request->title,
            'author' => $request->author,
            'doi' => $request->doi,
            'id_user' => $request->id_user,
            'lieu' => $request->lieu,
            'date' => $request->date,
            'status' => $status, // Statut défini en fonction de l'Etat de l'utilisateur
        ]);
    
        // Retourner une réponse JSON avec un message de succès
        return response()->json(['message' => 'Thèse soumise pour approbation avec succès!', 'these' => $these], 201);
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
            // Utilisation du modèle 'These'
            $these = These::create([
                'title' => $validatedData['title'],
                'author' => $validatedData['author'],
                'doi' => $validatedData['doi'],
                'id_user' => $validatedData['id_user'],
                'lieu' => $validatedData['lieu'],
                'date' => $validatedData['date'],
                'status' => 'approuvé', // Statut par défaut

            ]);

            return response()->json($these, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de l\'ajout de la thèse'], 500);
        }
    }


    /**
     * Display the specified thesis.
     *
     * @param \App\These $thesis
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $rapport = These::find($id);
        if ($rapport) {
            return response()->json($rapport);
        }
        return response()->json(['message' => 'Report non trouvé'], 404);
    }

    /**
     * Show the form for editing the specified thesis.
     *
     * @param \App\These $thesis
     * @return \Illuminate\Http\Response
     */


    /**
     * Update the specified thesis in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\These $thesis
     * @return \Illuminate\Http\Response
     */
    // public function update(Request $request, These $thesis)
    // {
    //     $request->validate([
    //         'title' => 'required|string|max:255',
    //         'author' => 'required|string|max:255',
    //         'DOI' => 'nullable|string|max:255',
    //         'id_user' => 'required|exists:users,id',
    //         'lieu' => 'required|string|max:255',
    //         'date' => 'required|date',
    //     ]);

    //     $thesis->update($request->all());
    //     return response()->json($thesis);
    // }

    /**
     * Remove the specified thesis from storage.
     *
     * @param \App\These $thesis
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $theses = These::find($id);
        if ($theses) {
            $theses->delete();
            return response()->json(['message' => 'these supprimé']);
        }
        return response()->json(['message' => 'these non trouvé'], 404);
    }

    public function getByUser($id_user)
    {
        // Récupérer les ouvrages associés à l'id_user spécifié
        $theses = These::where('id_user', $id_user)->get();


        // Retourner les ouvrages trouvés
        return response()->json($theses);
    }
    public function getTheseByUserOrContributor($id_user)
    {
        // Récupérer les ouvrages où id_user est l'utilisateur ou où il est dans une chaîne de IDs (contributeurs)
        $theses = These::where('id_user', $id_user)
            ->orWhere('id_user', 'like', '%' . $id_user . '%')
            ->get();

        return response()->json($theses);
    }
    public function checkDOIExists(Request $request)
    {
        $doi = $request->input('doi');
        $exists = These::where('DOI', $doi)->exists(); // Revue est le modèle pour votre table des revues

        return response()->json(['exists' => $exists]);
    }
    public function showUser($id)
    {
        $thesis = These::find($id);
        if ($thesis) {
            // Séparez les auteurs avec et sans ID
            $authorNames = explode(', ', $thesis->author);
            $authorIds = explode(',', $thesis->id_user);

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
                'title' => $thesis->title,
                'doi' => $thesis->doi, // Assurez-vous que le champ est en minuscules pour correspondre au frontend
                'authors_with_ids' => $authorsWithIds,
                'author_ids' => $authorIds,
                'authors_without_ids' => $authorsWithoutIds,
                'date' => $thesis->date, // Ajoutez d'autres attributs si nécessaire
                'lieu' => $thesis->lieu, // Ajoutez d'autres attributs si nécessaire
            ]);
        } else {
            return response()->json(['message' => 'Thesis not found'], 404);
        }
    }



    public function updateThese(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'doi' => 'required|string|max:255',  // Ensure 'doi' is lowercase
            'current_user_id' => 'required|integer',
            'author_names' => 'array',
            'id_user' => 'string', // IDs des auteurs
            'optional_authors' => 'array',
            'lieu' => 'required|string|max:255', // Lieu de soutenance
            'date' => 'required|date', // Date de soutenance
        ]);


        try {
            $these = These::findOrFail($id);

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

            // Mettre à jour les valeurs de la thèse
            $these->title = $title;
            $these->author = implode(', ', $finalAuthorNames);
            $these->doi = $doi;  // Assurez-vous d'utiliser 'doi' en minuscule
            $these->id_user = implode(',', $finalAuthorIds); // S'assurer que les IDs sont corrects
            $these->lieu = $lieu;
            $these->date = $date;
            $these->status = 'en attente';

            // Sauvegarder les modifications
            $these->save();

            return response()->json(['message' => 'Thèse mise à jour avec succès']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la mise à jour de la thèse', 'error' => $e->getMessage()], 500);
        }
    }
    public function updateTheseAdmin(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'doi' => 'required|string|max:255',  // Ensure 'doi' is lowercase
            'current_user_id' => 'required|integer',
            'author_names' => 'array',
            'id_user' => 'string', // IDs des auteurs
            'optional_authors' => 'array',
            'lieu' => 'required|string|max:255', // Lieu de soutenance
            'date' => 'required|date', // Date de soutenance
        ]);


        try {
            $these = These::findOrFail($id);

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

            // Mettre à jour les valeurs de la thèse
            $these->title = $title;
            $these->author = implode(', ', $finalAuthorNames);
            $these->doi = $doi;  // Assurez-vous d'utiliser 'doi' en minuscule
            $these->id_user = implode(',', $finalAuthorIds); // S'assurer que les IDs sont corrects
            $these->lieu = $lieu;
            $these->date = $date;
            $these->status = 'approuvé';

            // Sauvegarder les modifications
            $these->save();

            return response()->json(['message' => 'Thèse mise à jour avec succès']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la mise à jour de la thèse', 'error' => $e->getMessage()], 500);
        }
    }
    public function rejectThesis($id)
    {
        $thesis = These::findOrFail($id);
        $thesis->status = 'rejeté'; // Change status to 'rejeté'
        $thesis->save();

        return response()->json(['message' => 'Thèse rejetée avec succès!', 'thesis' => $thesis]);
    }

    public function getPendingTheses()
    {
        $theses = These::where('status', 'en attente')->get();
        return response()->json($theses);
    }

    public function getAcceptedTheses()
    {
        $theses = These::where('status', 'approuvé')->get();
        return response()->json($theses);
    }

    public function acceptThesis($id)
    {
        $thesis = These::findOrFail($id);
        $thesis->status = 'approuvé'; // Change status to 'approuvé'
        $thesis->save();

        return response()->json(['message' => 'Thèse acceptée avec succès!', 'thesis' => $thesis]);
    }


}
