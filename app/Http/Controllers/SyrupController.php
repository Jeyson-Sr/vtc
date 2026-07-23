<?php

namespace App\Http\Controllers;

use App\Models\Syrup;
use App\Models\SyrupIngredient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SyrupController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('jarabes/index', [
            'syrups' => Syrup::with('ingredients')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'sku' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'notes' => 'nullable|string',
        ]);

        Syrup::create($validated);

        return back()->with('success', 'Jarabe creado correctamente.');
    }

    public function update(Request $request, Syrup $syrup): RedirectResponse
    {
        $validated = $request->validate([
            'sku' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $syrup->update($validated);

        return back()->with('success', 'Jarabe actualizado correctamente.');
    }

    public function destroy(Syrup $syrup): RedirectResponse
    {
        $syrup->delete();

        return back()->with('success', 'Jarabe eliminado correctamente.');
    }

    public function storeIngredient(Request $request, Syrup $syrup): RedirectResponse
    {
        $validated = $request->validate([
            'cod_aje' => 'required|string|max:50',
            'cod_emb' => 'required|string|max:50',
            'description' => 'required|string|max:255',
            'um' => 'required|string|max:20',
            'factor' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'substitute_of_id' => 'nullable|exists:syrup_ingredients,id',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $syrup->ingredients()->create($validated);

        return back()->with('success', 'Ingrediente agregado correctamente.');
    }

    public function updateIngredient(Request $request, Syrup $syrup, SyrupIngredient $syrupIngredient): RedirectResponse
    {
        abort_unless($syrupIngredient->syrup_id === $syrup->id, 404);

        $validated = $request->validate([
            'cod_aje' => 'required|string|max:50',
            'cod_emb' => 'required|string|max:50',
            'description' => 'required|string|max:255',
            'um' => 'required|string|max:20',
            'factor' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'substitute_of_id' => 'nullable|exists:syrup_ingredients,id',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $syrupIngredient->update($validated);

        return back()->with('success', 'Ingrediente actualizado correctamente.');
    }

    public function destroyIngredient(Syrup $syrup, SyrupIngredient $syrupIngredient): RedirectResponse
    {
        abort_unless($syrupIngredient->syrup_id === $syrup->id, 404);

        $syrupIngredient->delete();

        return back()->with('success', 'Ingrediente eliminado correctamente.');
    }
}
