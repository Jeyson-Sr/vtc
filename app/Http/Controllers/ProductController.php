<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductIngredient;
use App\Models\Syrup;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('formulas/index', [
            'products' => Product::with(['ingredients', 'syrup'])
                ->orderBy('type')
                ->orderBy('name')
                ->get(),
            'syrups' => Syrup::orderBy('name')->get(['id', 'sku', 'name']),
            'categories' => ProductIngredient::PACKAGING_CATEGORIES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'sku' => 'required|string|max:50',
            'name' => 'required|string|max:255',
            'type' => 'required|in:envasado,auxiliar',
            'syrup_id' => 'nullable|exists:syrups,id',
            'units_per_package' => 'nullable|numeric|min:0',
            'syrup_factor' => 'nullable|numeric|min:0',
            'water_factor' => 'nullable|numeric|min:0',
            'yield_factor' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        Product::create($validated);

        return back()->with('success', 'Fórmula creada correctamente.');
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'sku' => 'required|string|max:50',
            'name' => 'required|string|max:255',
            'type' => 'required|in:envasado,auxiliar',
            'syrup_id' => 'nullable|exists:syrups,id',
            'units_per_package' => 'nullable|numeric|min:0',
            'syrup_factor' => 'nullable|numeric|min:0',
            'water_factor' => 'nullable|numeric|min:0',
            'yield_factor' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $product->update($validated);

        return back()->with('success', 'Fórmula actualizada correctamente.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return back()->with('success', 'Fórmula eliminada correctamente.');
    }

    public function storeIngredient(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'cod_aje' => 'required|string|max:50',
            'cod_emb' => 'required|string|max:50',
            'description' => 'required|string|max:255',
            'um' => 'required|string|max:20',
            'factor' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:50',
            'is_active' => 'boolean',
            'substitute_of_id' => 'nullable|exists:product_ingredients,id',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $product->ingredients()->create($validated);

        return back()->with('success', 'Insumo agregado correctamente.');
    }

    public function updateIngredient(Request $request, Product $product, ProductIngredient $productIngredient): RedirectResponse
    {
        abort_unless($productIngredient->product_id === $product->id, 404);

        $validated = $request->validate([
            'cod_aje' => 'required|string|max:50',
            'cod_emb' => 'required|string|max:50',
            'description' => 'required|string|max:255',
            'um' => 'required|string|max:20',
            'factor' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:50',
            'is_active' => 'boolean',
            'substitute_of_id' => 'nullable|exists:product_ingredients,id',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $productIngredient->update($validated);

        return back()->with('success', 'Insumo actualizado correctamente.');
    }

    public function destroyIngredient(Product $product, ProductIngredient $productIngredient): RedirectResponse
    {
        abort_unless($productIngredient->product_id === $product->id, 404);

        $productIngredient->delete();

        return back()->with('success', 'Insumo eliminado correctamente.');
    }
}
