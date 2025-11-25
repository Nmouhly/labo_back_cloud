<?php
namespace App\Http\Controllers;

use App\Member;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;



class MemberController extends Controller
{
    public function index(Request $request)
    {
        $teamId = $request->query('team_id');

        // Filter by team_id if provided
        if ($teamId) {
            $members = Member::where('team_id', $teamId)->get();
        } else {
            $members = Member::all();
        }

        return response()->json($members);
    }

//     public function store(Request $request)
//     {
//         $request->validate([
//             'name' => 'required|string|max:255',
//             'position' => 'required|string|max:255',
//             'contact_info' => 'required|string|max:255',
//             'team_id' => 'nullable|integer|exists:teams,id',
//             'email' => 'required|string|email|max:255|unique:members,email',
//             'user_id' => 'nullable|integer|exists:users,id',
//             'statut' => 'nullable|string|max:255',
//             'bio' => 'nullable|string',
//             'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
           
//         ]);

//         try {
//             $user = User::findOrFail($request->input('user_id'));

//             $member = new Member();
//             $member->name = $request->input('name');
//             $member->position = $request->input('position');
//             $member->contact_info = $request->input('contact_info');
//             $member->team_id = $request->input('team_id');
//             $member->user_id = $request->input('user_id');
//             $member->statut = $request->input('statut', 'Membre');
//             $member->bio = $request->input('bio');
//             $member->email = $user->email; // Associate User's email with Member

//             // Handle image upload if provided
//             if ($request->hasFile('image')) {
//                 $imagePath = $request->file('image')->store('member_images', 'public');
//                 $member->image = $imagePath;
//             }
            

//             $member->save();

//             return response()->json($member, 201);
//         } catch (\Exception $e) {
//             Log::error('Erreur lors de l\'ajout du membre: ' . $e->getMessage());
//             return response()->json(['error' => 'Erreur lors de l\'ajout du membre'], 500);
//         }
//     }
    // public function updateMember(Request $request, $id)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'position' => 'nullable|string|max:255',
    //         'bio' => 'nullable|string',
    //         'contact_info' => 'nullable|string',
    //         'image' => 'nullable|string', // Assuming the image is in base64 format
    //     ]);
    
    //     if ($validator->fails()) {
    //         return response()->json($validator->errors(), 422);
    //     }
    
    //     $member = Member::find($id);
    
    //     if (!$member) {
    //         return response()->json(['error' => 'Membre non trouvé'], 404);
    //     }
    
    //     $member->update([
    //         'position' => $request->input('position', $member->position),
    //         'bio' => $request->input('bio', $member->bio),
    //         'contact_info' => $request->input('contact_info', $member->contact_info),
    //     ]);
    
    //     if ($request->image) {
    //         // Supprimer l'ancienne image si elle existe
    //         if ($member->image) {
    //             Storage::disk('public')->delete($member->image);
    //         }

    //         // Décoder et enregistrer la nouvelle image
    //         $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $request->image));
    //         $imageName = uniqid() . '.png'; // Nommez l'image avec un nom unique
    //         $imagePath = 'member_images/' . $imageName;
    //         Storage::disk('public')->put($imagePath, $imageData);

    //         $member->image = $imagePath;
    //     }
    //     $member->save();
    //     return response()->json($member);
    // }
 


public function updateMember(Request $request, $id)
{
    $validator = Validator::make($request->all(), [
        'position' => 'nullable|string|max:255',
        'bio' => 'nullable|string',
        'contact_info' => 'nullable|string',
        'image' => 'nullable|string', // L'image est supposée être au format base64
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    $member = Member::find($id);

    if (!$member) {
        return response()->json(['error' => 'Membre non trouvé'], 404);
    }

    // Mise à jour des informations du membre
    $member->update([
        'position' => $request->input('position', $member->position),
        'bio' => $request->input('bio', $member->bio),
        'contact_info' => $request->input('contact_info', $member->contact_info),
    ]);

    // Gestion de l'image
    if ($request->image) {
        // Supprimer l'ancienne image de Cloudinary
        if ($member->image) {
            // Extraire le public_id de l'URL de l'image actuelle
            $publicId = explode('/', $member->image);
            $publicId = end($publicId); // Obtient le nom de l'image
            $publicId = str_replace('.png', '', $publicId); // Retire l'extension si nécessaire

            // Supprimer l'ancienne image de Cloudinary
            Cloudinary::destroy($publicId);
        }

        // Décoder et télécharger la nouvelle image sur Cloudinary
        $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $request->image));
        $uploadedFile = Cloudinary::upload($request->image)->getSecurePath();
        
        // Mettre à jour le chemin de l'image
        $member->image = $uploadedFile;
    }

    // Enregistrer les modifications dans la base de données
    $member->save();

    return response()->json($member);
}

    public function show($id)
    {
        $member = Member::findOrFail($id);
        return response()->json($member);
    }

    public function getByUserId($userId)
{
    // Trouver le membre par user_id
    $member = Member::where('user_id', $userId)->first();

    if ($member) {
        return response()->json($member);
    } else {
        return response()->json(['message' => 'Membre non trouvé'], 404);
    }
}
// //     public function update(Request $request, $id)
// // {
// //     // Validation des données de la requête
// //     $request->validate([
// //         'position' => 'required|string|max:255',
// //         'contact_info' => 'required|string|max:255',
// //         'bio' => 'nullable|string',
// //         'user_id' => 'nullable|integer|exists:users,id',
// //         'team_id' => 'nullable|integer|exists:teams,id',
// //         'statut' => 'nullable|string|max:255',
// //         'image' => 'nullable|string', // Validation de l'image en base64
// //     ]);

// //     // Trouver le membre
// //     $member = Member::find($id);

// //     if ($member) {
// //         // Mettre à jour les données du membre
// //         $member->update($request->only([
// //             'position',
// //             'contact_info',
// //             'bio',
// //             'team_id',
// //             'user_id',
// //             'statut'
// //         ]));

// //         // Gestion de l'image
// //         if ($request->image) {
// //             // Supprimer l'ancienne image si elle existe
// //             if ($member->image) {
// //                 Storage::disk('public')->delete($member->image);
// //             }

// //             try {
// //                 // Décoder et enregistrer la nouvelle image
// //                 $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $request->image));
// //                 $imageName = uniqid() . '.png'; // Nommez l'image avec un nom unique
// //                 $imagePath = 'images/member_images/' . $imageName;
// //                 Storage::disk('public')->put($imagePath, $imageData);

// //                 $member->image = $imagePath;
// //             } catch (\Exception $e) {
// //                 Log::error('Erreur lors du traitement de l\'image: ' . $e->getMessage());
// //                 return response()->json(['error' => 'Erreur lors du traitement de l\'image'], 500);
// //             }
// //         }

// //         // Gestion du changement de statut à "Ancien"
// //         if ($request->input('statut') === 'Ancien') {
// //             $member->update(['user_id' => null]);

// //             if ($request->input('user_id')) {
// //                 try {
// //                     $user = User::findOrFail($request->input('user_id'));
// //                     $user->delete();
// //                 } catch (\Exception $e) {
// //                     Log::error('Erreur lors de la suppression de l\'utilisateur: ' . $e->getMessage());
// //                     return response()->json(['error' => 'Erreur lors de la suppression de l\'utilisateur'], 500);
// //                 }
// //             }
// //         }

// //         return response()->json($member);
// //     }

// //     return response()->json(['message' => 'Membre non trouvé'], 404);
// // }
// public function update(Request $request, $id)
// {
//     $request->validate([
//         'name' => 'required|string|max:255',
//         'position' => 'required|string|max:255',
//         'bio' => 'required|string',
//         'contact_info' => 'required|string',
//         'statut' => 'required|string',
//         'email' => 'required|email',
//         'image' => 'nullable|string', // Validation de l'image en base64
//     ]);

//     $member = Member::find($id);

//     if ($member) {
//         $member->name = $request->name;
//         $member->position = $request->position;
//         $member->bio = $request->bio;
//         $member->contact_info = $request->contact_info;
//         $member->statut = $request->statut;
//         $member->email = $request->email;

//         if ($request->hasFile('image')) {
//             // Supprimer l'ancienne image si elle existe
//             if ($member->image) {
//                 Storage::disk('public')->delete($member->image);
//             }

//             // Décoder et enregistrer la nouvelle image
//             $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $request->image));
//             $imageName = uniqid() . '.png'; // Nommez l'image avec un nom unique
//             $imagePath = 'member_images/' . $imageName;
//             Storage::disk('public')->put($imagePath, $imageData);

//             $member->image = $imagePath;
//         }

//         if ($request->input('statut') === 'Ancien') {
//             // Si le membre devient "Ancien", désassigner l'utilisateur
//             $userId = $member->user_id;
            
        
//             // Supprimer l'utilisateur associé
//             if ($userId) {
//                 try {
//                     $user = User::findOrFail($userId);
//                     $user->delete(); // Supprimer l'utilisateur
//                 } catch (\Exception $e) {
//                     // Enregistrer l'erreur dans les logs si la suppression échoue
//                     Log::error('Erreur lors de la suppression de l\'utilisateur: ' . $e->getMessage());
//                     return response()->json(['error' => 'Erreur lors de la suppression de l\'utilisateur'], 500);
//                 }
//             }
//         }

//         $member->save();

//         return response()->json($member);
//     }

//     return response()->json(['message' => 'Membre non trouvé'], 404);
// }

//     public function destroy($id)
//     {
//         $member = Member::findOrFail($id);

//         // Delete associated image if it exists
//         if ($member->image) {
//             Storage::disk('public')->delete($member->image);
//         }

//         $member->delete();
//         return response()->json(null, 204);
//     }
public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'position' => 'required|string|max:255',
        'contact_info' => 'required|string|max:255',
        'team_id' => 'nullable|integer|exists:teams,id',
        'email' => 'required|string|email|max:255|unique:members,email',
        'user_id' => 'nullable|integer|exists:users,id',
        'statut' => 'nullable|string|max:255',
        'bio' => 'nullable|string',
        'image' => 'nullable|string',
    ]);

    try {
        $user = User::findOrFail($request->input('user_id'));

        $member = new Member();
        $member->name = $request->input('name');
        $member->position = $request->input('position');
        $member->contact_info = $request->input('contact_info');
        $member->team_id = $request->input('team_id');
        $member->user_id = $request->input('user_id');
        $member->statut = $request->input('statut', 'Membre');
        $member->bio = $request->input('bio');
        $member->email = $user->email; // Associer l'email de l'utilisateur au membre

        // Gérer le téléchargement de l'image si fourni
       
    if ($request->image) {
        // Télécharger l'image sur Cloudinary
        $uploadedFileUrl = Cloudinary::upload($request->image)->getSecurePath();
        $member->image = $uploadedFileUrl;
    }


        $member->save();

        return response()->json($member, 201);
    } catch (\Exception $e) {
        Log::error('Erreur lors de l\'ajout du membre: ' . $e->getMessage());
        return response()->json(['error' => 'Erreur lors de l\'ajout du membre'], 500);
    }
}

// Mettre à jour un membre existant
public function update(Request $request, $id)
{
    // Validation des données
    $request->validate([
        'name' => 'required|string|max:255',
        'position' => 'required|string|max:255',
        'bio' => 'required|string',
        'contact_info' => 'required|string',
        'statut' => 'required|string',
        'email' => 'required|email',
        'image' => 'nullable|string',
    ]);

    // Trouver le membre par ID
    $member = Member::find($id);

    if ($member) {
        // Mettre à jour les attributs du membre
        $member->name = $request->name;
        $member->position = $request->position;
        $member->bio = $request->bio;
        $member->contact_info = $request->contact_info;
        $member->statut = $request->statut;
        $member->email = $request->email;

        // Gestion de l'image
        if ($request->image) {
            // Supprimer l'ancienne image de Cloudinary
            if ($member->image) {
                // Extraire le public_id de l'URL de l'image actuelle
                $publicId = explode('/', $member->image);
                $publicId = end($publicId); // Obtient le nom de l'image
                $publicId = str_replace('.png', '', $publicId); // Retire l'extension si nécessaire

                // Supprimer l'ancienne image de Cloudinary
                Cloudinary::destroy($publicId);
            }

            // Télécharger la nouvelle image sur Cloudinary
            $uploadedFileUrl = Cloudinary::upload($request->image)->getSecurePath();
            $member->image = $uploadedFileUrl;
        }

        // Enregistrer les modifications dans la base de données
        $member->save();

        return response()->json($member);
    }

    return response()->json(['message' => 'Membre non trouvé'], 404);
}


// Supprimer un membre
public function destroy($id)
{
    $member = Member::findOrFail($id);

    // Supprimer l'image associée dans Cloudinary si elle existe
    if ($member->image) {
        $publicId = substr($member->image, strrpos($member->image, '/') + 1, strrpos($member->image, '.') - strrpos($member->image, '/') - 1);
        Cloudinary::destroy("member_images/$publicId");
    }

    $member->delete();
    return response()->json(null, 204);
}
}
