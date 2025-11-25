<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Hash;
use App\Mail\WelcomeEmail;
use Illuminate\Support\Facades\Mail;
use App\User;
use App\Member; // Utilisez App\Models\User au lieu de App\User si vous utilisez Laravel 8+
use Illuminate\Http\Request;
use App\Http\Requests\StoreUserRequest;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\AuthUserRequest;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // public function store(Request $request)
    // {
    //     // Validation des données de la requête
    //     $validator = Validator::make($request->all(), [
    //         'name' => 'required|string|max:255',
    //         'email' => 'required|string|email|max:255|unique:users',
    //         'password' => 'required|string|min:8',
    //         'role' => 'required|integer|in:0,1', // Validation du rôle pour s'assurer qu'il est soit 0 soit 1
    //     ]);

    //     // Retourner une réponse en cas d'erreurs de validation
    //     if ($validator->fails()) {
    //         return response()->json([
    //             'errors' => $validator->errors(),
    //         ], 422);
    //     }

    //     // Création de l'utilisateur
    //     $user = User::create([
    //         'name' => $request->input('name'),
    //         'email' => $request->input('email'),
    //         'password' => Hash::make($request->input('password')), // Hachage du mot de passe
    //         'role' => (int) $request->input('role'), // Conversion en entier
    //     ]);

    //     // Retourner une réponse de succès
    //     return response()->json([
    //         'message' => 'Utilisateur créé avec succès.',
    //         'user' => $user,
    //     ], 201);
    // }
    public function store(Request $request)
    {
        // Validation des données de la requête
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|integer|in:0,1', // Validation du rôle pour s'assurer qu'il est soit 0 soit 1
            'bio' => 'nullable|string|max:500', // Validation du bio, non obligatoire
            'Etat' => 'required|string|in:approuve,non approuve',
        ]);

        // Retourner une réponse en cas d'erreurs de validation
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        // Création de l'utilisateur
        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')), // Hachage du mot de passe
            'role' => (int) $request->input('role'), // Conversion en entier
            'bio' => $request->input('bio', ''), // Valeur par défaut vide si non fourni
            'Etat' => $request->input('Etat'),
        ]);

        // if($user){$user->notify(new ActionNotification());}
        // Retourner une réponse de succès
        return response()->json([
            'message' => 'Utilisateur créé avec succès.',
            'user' => $user,
        ], 201);
    }


    public function auth(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'error' => 'Ces identifiants ne correspondent à aucun de nos enregistrements.'
            ], 401);
        }
        // Vérifier si c'est la première connexion
        if ($user->first_login) {
            // Envoyer l'e-mail de bienvenue

            Mail::to($user->email)->send(new WelcomeEMail($user->name));

            // Mettre à jour le champ first_login
            $user->first_login = false;
            $user->save();
        }


        if ($user->role === 1) {
            return response()->json([
                'user' => $user,
                'currentToken' => $user->createToken('new_user')->plainTextToken,
                'message' => 'Connexion réussie. Vous êtes un admin.',
            ]);
        } else {
            return response()->json([
                'user' => $user,
                'currentToken' => $user->createToken('new_user')->plainTextToken,
                'message' => 'Connexion réussie. Vous êtes un utilisateur.',
            ]);
        }
    }


    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Logout has been created successfully.'
        ]);
    }

    public function checkingAuthenticated(Request $request)
    {
        // Vérifie si l'utilisateur est authentifié
        $isAuthenticated = Auth::check();

        return response()->json([
            'isAuthenticated' => $isAuthenticated
        ]);
    }

    public function profil(Request $request)
    {
        // Récupère l'utilisateur actuellement authentifié via le token
        $user = Auth::user();

        // Retourner les infos de l'utilisateur en JSON
        return response()->json([
            'user' => $user
        ], 200);
    }
    public function getUserIdByEmail(Request $request)
    {
        // Validation de l'email
        $request->validate([
            'email' => 'required|email'
        ]);

        // Rechercher l'utilisateur par email
        $user = User::where('email', $request->input('email'))->first();

        // Vérifier si l'utilisateur existe
        if (!$user) {
            return response()->json([
                'user_id' => null,
                'message' => 'Utilisateur non trouvé.'
            ]);
        }

        // Retourner l'ID de l'utilisateur
        return response()->json([
            'user_id' => $user->id
        ]);
    }


    public function checkCredentials(Request $request)
    {
        // Validation des entrées
        $request->validate([
            // 'email' => 'required|email',
            'password' => 'required',
        ]);

        // Récupérer l'utilisateur actuellement authentifié
        $user = Auth::user();

        // Vérifier si l'email et le mot de passe correspondent
        if (Hash::check($request->password, $user->password)) {
            // if ($user && $user->email === $request->email && Hash::check($request->password, $user->password))
            return response()->json(['message' => 'Credentials are valid'], 200);
        } else {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    }


    // CRUD Functions
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::find($id);
        if ($user) {
            return response()->json($user);
        } else {
            return response()->json([
                'error' => 'User not found.'
            ], 404);
        }
    }
    public function updateUser(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        $user->update([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => $request->has('password') ? Hash::make($request->password) : $user->password,

        ]);

        return response()->json(['message' => 'Utilisateur mis à jour avec succès', 'user' => $user], 200);
    }


    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|required|string|min:8',
            'role' => 'sometimes|required|integer|in:0,1',
            'Etat' => 'sometimes|required|string|in:approuve,non approuve',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        $user->update([
            'name' => $request->input('name', $user->name),
            'email' => $request->input('email', $user->email),
            'password' => $request->has('password') ? Hash::make($request->password) : $user->password,
            'role' => $request->input('role', $user->role),
            'Etat' => $request->input('Etat', $user->Etat),
        ]);

        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if ($user) {
            // Find the associated Member with the same email
            $member = Member::where('email', $user->email)->first();

            if ($member) {
                // Update the Member's status to 'ancien'
                $member->update(['statut' => 'ancien']);
            }

            // Delete the user
            $user->delete();

            return response()->json([
                'message' => 'User and associated member status updated successfully.'
            ]);
        } else {
            return response()->json([
                'error' => 'User not found.'
            ], 404);
        }
    }
    public function updateStatus(Request $request, $id)
    {
        // Valider la requête pour s'assurer que l'état est fourni
        $request->validate([
            'Etat' => 'required|string|in:approuve,non approuve', // Assurez-vous que ce sont les états valides
        ]);

        // Trouver l'utilisateur par ID
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        // Mettre à jour l'état de l'utilisateur
        $user->Etat = $request->Etat;
        $user->save();

        return response()->json(['message' => 'État de l\'utilisateur mis à jour avec succès']);
    }


}