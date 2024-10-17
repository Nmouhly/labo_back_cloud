<?php
namespace App\Http\Controllers;
use App\Axe;
use Illuminate\Http\Request;

class AxeController extends Controller
{
    // Affiche la liste des axes, avec possibilité de filtrage par team_id
    public function index(Request $request)
    {
        $teamId = $request->query('team_id');
        
        // Filtrer par team_id si fourni
        if ($teamId) {
            $axes = Axe::where('team_id', $teamId)->get();
        } else {
            $axes = Axe::all();
        }

        return response()->json($axes);
    }

    // Stocke un nouvel axe dans la base de données
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'team_id' => 'nullable|integer|exists:teams,id', // Validation pour team_id
        ]);

        $axe = Axe::create($request->all());
        return response()->json($axe, 201);
    }

    // Affiche un axe spécifique
    public function show($id)
    {
        $axe = Axe::find($id);

        if (!$axe) {
            return response()->json(['message' => 'Axe not found'], 404);
        }

        return response()->json($axe);
    }

    // Met à jour un axe spécifique dans la base de données
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string', // 'content' est maintenant optionnel
            'team_id' => 'nullable|integer|exists:teams,id', // Validation pour team_id
        ]);

        $axe = Axe::findOrFail($id);
        $axe->update($request->only([
            'title',
            'content',
            'team_id', // Inclure team_id pour la mise à jour
        ]));

        return response()->json($axe);
    }

    // Supprime un axe spécifique de la base de données
    public function destroy($id)
    {
        $axe = Axe::findOrFail($id);
        $axe->delete();
        return response()->json(['message' => 'Axe supprimé avec succès']);
    }
}
