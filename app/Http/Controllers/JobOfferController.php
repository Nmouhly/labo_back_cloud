<?php

namespace App\Http\Controllers;
use App\JobOffer;
use Illuminate\Http\Request;

class JobOfferController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $jobOffers = JobOffer::all();
        return response()->json($jobOffers);
    }

    // Afficher une offre d'emploi spécifique
    public function show($id)
    {
        $jobOffer = JobOffer::findOrFail($id);
        return response()->json($jobOffer);
    }

    // Créer une nouvelle offre d'emploi
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'location' => 'required|string',
            'salary' => 'nullable|numeric',
            'deadline' => 'required|date',
        ]);

        $jobOffer = JobOffer::create($validatedData);

        return response()->json($jobOffer, 201);
    }

    // Mettre à jour une offre d'emploi existante
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'requirements' => 'sometimes|required|string',
            'location' => 'sometimes|required|string',
            'salary' => 'nullable|numeric',
            'deadline' => 'sometimes|required|date',
        ]);

        $jobOffer = JobOffer::findOrFail($id);
        $jobOffer->update($validatedData);

        return response()->json($jobOffer);
    }

    // Supprimer une offre d'emploi
    public function destroy($id)
    {
        $jobOffer = JobOffer::findOrFail($id);
        $jobOffer->delete();

        return response()->json(null, 204);
    }
}
