<?php

namespace App\Http\Controllers;
use App\Presentation;
use Illuminate\Http\Request;

class PresentationController extends Controller
{
    public function index(Request $request)
    {
        $teamId = $request->query('team_id');
    
        // Filtre par team_id si fourni
        if ($teamId) {
            $presentations = Presentation::where('team_id', $teamId)->get();
        } else {
            $presentations = Presentation::all();
        }
    
        return response()->json($presentations);
    }
    

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'team_id' => 'nullable|integer|exists:teams,id', // Validation pour team_id
        ]);

        $presentation = Presentation::create($request->all());

        return response()->json($presentation, 201);
    }

    public function show($id)
    {
        $presentation = Presentation::findOrFail($id);
        return response()->json($presentation);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'team_id' => 'nullable|integer|exists:teams,id', // Validation pour team_id
        ]);

        $presentation = Presentation::findOrFail($id);
        $presentation->update($request->all());

        return response()->json($presentation);
    }

    public function destroy($id)
    {
        $presentation = Presentation::findOrFail($id);
        $presentation->delete();

        return response()->json(['message' => 'Presentation deleted']);
    }
}
