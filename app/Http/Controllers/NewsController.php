<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Storage; 
use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Log;
use App\News;
class NewsController extends Controller
{
    public function index()
    {
        return News::all();
    }

    // Get single news item
    public function show($id)
    {
        return News::findOrFail($id);
    }

    // Create a new news item
    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'title' => 'required|string|max:255',
    //         'content' => 'required|string',
    //         'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    //     ]);

    //     $news = new News();
    //     $news->title = $request->title;
    //     $news->content = $request->content;

    //     if ($request->hasFile('image')) {
    //         $imagePath = $request->file('image')->store('news_images', 'public');
    //         $news->image = $imagePath;
    //     }

    //     $news->save();

    //     return response()->json($news, 201);
    // }
// 
// public function store(Request $request)
// {
//     // Validation des données
//     $request->validate([
//         'title' => 'required|string|max:255',
//         'content' => 'required|string',
//         'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
//     ]);

//     // Création d'une nouvelle actualité
//     $news = new News();
//     $news->title = $request->title;
//     $news->content = $request->content;

//     // Vérification et upload de l'image
//     if ($request->hasFile('image')) {
//         $result = Cloudinary::upload($request->file('image')->getRealPath(), [
//             'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET')
//         ]);
//         $news->image = $result->getSecureUrl(); // URL de l'image uploadée
//     }

//     // Enregistrement de l'actualité
//     $news->save();

//     return response()->json($news, 201);
// }
public function store(Request $request)
{
    $request->validate([
        'title' => 'required|string|max:255',
        'content' => 'required|string',
        'image' => 'nullable|string', // L'image est envoyée en tant que chaîne base64
    ]);

    $news = new News();
    $news->title = $request->title;
    $news->content = $request->content;

    if ($request->image) {
        // Télécharger l'image sur Cloudinary
        $uploadedFileUrl = Cloudinary::upload($request->image)->getSecurePath();
        $news->image = $uploadedFileUrl;
    }

    $news->save();

    return response()->json($news, 201);
}
 


public function update(Request $request, $id)
{
    $request->validate([
        'title' => 'required|string|max:255',
        'content' => 'required|string',
        'image' => 'nullable|string', // Validation de l'image en base64
    ]);

    $news = News::find($id);

    if ($news) {
        $news->title = $request->title;
        $news->content = $request->content;

        if ($request->image) {
            // Supprimer l'ancienne image de Cloudinary
            if ($news->image) {
                // Extraire le public_id de l'URL de l'image actuelle
                $publicId = explode('/', $news->image);
                $publicId = end($publicId); // Obtient le nom de l'image
                $publicId = str_replace('.png', '', $publicId); // Retire l'extension si nécessaire

                // Supprimer l'ancienne image de Cloudinary
                Cloudinary::destroy($publicId);
            }

            // Télécharger la nouvelle image sur Cloudinary
            $uploadedFileUrl = Cloudinary::upload($request->image)->getSecurePath();
            $news->image = $uploadedFileUrl;
        }

        $news->save();

        return response()->json($news);
    }

    return response()->json(['message' => 'News non trouvée'], 404);
}


    // Delete a news item
    public function destroy($id)
    {
        $news = News::findOrFail($id);

        if ($news->image) {
            Storage::disk('public')->delete($news->image);
        }

        $news->delete();

        return response()->json(null, 204);
    }
}
