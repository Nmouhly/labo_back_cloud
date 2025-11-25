<?php

namespace App\Http\Controllers;
use App\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    // Envoyer un message
    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => auth()->id(),
            'receiver_id' => $validated['receiver_id'],
            'message' => $validated['message'],
        ]);

        return response()->json($message, 201);
    }

    public function getSentMessages(Request $request)
{
    $perPage = $request->get('per_page', 10); // Nombre de messages par page
    $messages = Message::where('sender_id', auth()->id()) // Filtrer uniquement les messages envoyés
        ->with('sender', 'receiver')
        ->orderBy('created_at', 'desc')
        ->paginate($perPage);

    return response()->json($messages);
}
public function getReceivedMessages(Request $request)
{
    $perPage = $request->get('per_page', 10); // Nombre de messages par page
    $messages = Message::where('receiver_id', auth()->id()) // Filtrer uniquement les messages reçus
        ->with('sender', 'receiver')
        ->orderBy('created_at', 'desc')
        ->paginate($perPage);

    return response()->json($messages);
}
public function show($id)
{
    // Récupère le message par son ID
    $message = Message::with(['sender', 'receiver'])->find($id);

    // Vérifie si le message existe
    if (!$message) {
        return response()->json(['error' => 'Message not found'], 404);
    }

    return response()->json($message);
}
     // Marquer un message comme lu
    // public function markAsReaded($id)
    // {
    //     $message = Message::where('receiver_id', auth()->id())->findOrFail($id);
    //     $message->update(['read' => true]);

    //     return response()->json(['message' => 'Message marked as read']);
    // }
    public function markAsRead(Request $request, $id)
{
    // Trouver le message
    $message = Message::find($id);

    if (!$message) {
        return response()->json(['message' => 'Message not found'], 404);
    }

    // Mettre à jour le champ 'read' à 1
    $message->read = 1;
    $message->save();

    return response()->json(['message' => 'Message marked as read']);
}
 public function markAsNotRead(Request $request, $id)
{
    // Trouver le message
    $message = Message::find($id);

    if (!$message) {
        return response()->json(['message' => 'Message not found'], 404);
    }

    // Mettre à jour le champ 'read' à 1
    $message->read = 0;
    $message->save();

    return response()->json(['message' => 'Message marked as read']);
}

}