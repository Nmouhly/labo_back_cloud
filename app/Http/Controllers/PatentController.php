<?php

namespace App\Http\Controllers;
use App\Patent;
use Illuminate\Http\Request;

class PatentController extends Controller
{
    public function index()
    {
        $patents = Patent::all();
        return response()->json($patents);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'filing_date' => 'required|date',
            'pdf_link' => 'nullable|url',
        ]);

        $patent = Patent::create($validatedData);
        return response()->json($patent, 201);
    }

    public function show($id)
    {
        $patent = Patent::findOrFail($id);
        return response()->json($patent);
    }

    public function update(Request $request, $id)
    {
        $patent = Patent::findOrFail($id);

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'filing_date' => 'required|date',
            'pdf_link' => 'nullable|url',
        ]);

        $patent->update($validatedData);
        return response()->json($patent);
    }

    public function destroy($id)
    {
        $patent = Patent::findOrFail($id);
        $patent->delete();
        return response()->json(null, 204);
    }

}
