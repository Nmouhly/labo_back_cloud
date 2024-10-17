<?php

namespace App\Http\Controllers;
use App\Conference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ConferenceController extends Controller
{

    // Récupérer et retourner toutes les conférences
    public function index()
    {
        $conferences = Conference::all();
        return response()->json($conferences);
    }

    // Récupérer une conférence par son ID
    public function show($id)
    {
        $conference = Conference::find($id);
        if ($conference) {
            return response()->json($conference);
        }
        return response()->json(['message' => 'Conférence non trouvée'], 404);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'location' => 'required|string|max:255',
            'image' => 'nullable|string', // L'image sera envoyée en base64
        ]);
    
        $conference = new Conference();
        $conference->title = $request->title;
        $conference->date = $request->date;
        $conference->location = $request->location;
    
        if ($request->image) {
            // Télécharger l'image sur Cloudinary
            $uploadedFileUrl = Cloudinary::upload($request->image)->getSecurePath();
            $conference->image = $uploadedFileUrl;
        }
    
        $conference->save();
    
        return response()->json($conference, 201);
    }
    
 


    public function update(Request $request, $id)
{
    $request->validate([
        'title' => 'required|string|max:255',
        'date' => 'required|date',
        'location' => 'required|string|max:255',
        'image' => 'nullable|string', // L'image sera envoyée en base64
    ]);

    $conference = Conference::find($id);

    if ($conference) {
        $conference->title = $request->title;
        $conference->date = $request->date;
        $conference->location = $request->location;

        if ($request->image) {
            // Supprimer l'ancienne image de Cloudinary
            if ($conference->image) {
                // Extraire le public_id de l'URL de l'image actuelle
                $publicId = pathinfo($conference->image, PATHINFO_FILENAME);
                
                // Supprimer l'ancienne image de Cloudinary
                Cloudinary::destroy($publicId);
            }

            // Télécharger la nouvelle image sur Cloudinary
            $uploadedFileUrl = Cloudinary::upload($request->image)->getSecurePath();
            $conference->image = $uploadedFileUrl;
        }

        $conference->save();

        return response()->json($conference);
    }

    return response()->json(['message' => 'Conférence non trouvée'], 404);
}


    // Supprimer une conférence
    public function destroy($id)
    {
        $conference = Conference::find($id);
        if ($conference) {
            $conference->delete();
            return response()->json(['message' => 'Conférence supprimée avec succès!']);
        }
        return response()->json(['message' => 'Conférence non trouvée'], 404);
    }
}
