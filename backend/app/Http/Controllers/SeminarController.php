<?php

namespace App\Http\Controllers;

use App\Seminar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SeminarController extends Controller
{
    public function index()
    {
        $seminars = Seminar::all();
        return response()->json($seminars);
    }

    public function store(Request $request)
    {
        // Validation pour le modèle Seminar
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
           'end_time' => 'required|date_format:H:i',
            'location' => 'required|string|max:255',
            'speaker' => 'required|string|max:255',
            'status' => 'nullable|string|max:255',
        ]);

        try {
            $seminar = Seminar::create([
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'date' => $request->input('date'),
                'start_time' => $request->input('start_time'),
                'end_time' => $request->input('end_time'),
                'location' => $request->input('location'),
                'speaker' => $request->input('speaker'),
                'status' => $request->input('status'),
            ]);

            return response()->json($seminar, 201);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'ajout du séminaire: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de l\'ajout du séminaire'], 500);
        }
    }

    public function show($id)
    {
        $seminar = Seminar::findOrFail($id);
        return response()->json($seminar);
    }

    public function update(Request $request, $id)
    {
        // Validation mise à jour pour inclure les champs spécifiques aux séminaires
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
           'end_time' => 'required|date_format:H:i',
            'location' => 'required|string|max:255',
            'speaker' => 'required|string|max:255',
            'status' => 'nullable|string|max:255', // Validation pour le champ 'status' avec les valeurs autorisées
        ]);
    
        $seminar = Seminar::findOrFail($id);
        $seminar->update($request->only([
            'title',
            'description',
            'date',
           'start_time',
           'end_time',
            'location',
            'speaker',
            'status' // Inclure 'status' lors de la mise à jour
        ]));
    
        return response()->json($seminar);
    }


    public function destroy($id)
    {
        $seminar = Seminar::findOrFail($id);
        $seminar->delete();
        return response()->json(null, 204);
    }
    public function ongoingSeminars()
    {
        $ongoingProjects = Seminar::where('status', 'prevu')->get();
        return response()->json($ongoingProjects);
    }

    public function completedSeminars()
    {
        $completedProjects = Seminar::where('status', 'passe')->get();
        return response()->json($completedProjects);
    }
}
