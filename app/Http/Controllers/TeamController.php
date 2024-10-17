<?php

namespace App\Http\Controllers;

use App\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index()
    {
        return response()->json(Team::all());
    }

    public function show($id)
    {
        return response()->json(Team::findOrFail($id));
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'specialization' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $team = Team::create($validatedData);
        return response()->json($team, 201);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'specialization' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $team = Team::findOrFail($id);
        $team->update($validatedData);
        return response()->json($team, 200);
    }


    public function destroy($id)
    {
        Team::destroy($id);
        return response()->json(null, 204);
    }
}
