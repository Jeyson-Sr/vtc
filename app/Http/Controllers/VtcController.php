<?php

namespace App\Http\Controllers;

use App\Mail\ContactoMail;
use App\Models\Product;
use App\Models\Syrup;
use App\Services\VtcCalculator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class VtcController extends Controller
{
    public function __construct(private VtcCalculator $calculator) {}

    public function index(): Response
    {
        return Inertia::render('vtc/index', [
            'products' => Product::with('syrup')
                ->orderBy('type')
                ->orderBy('name')
                ->get(),
            'syrups' => Syrup::orderBy('name')->get(['id', 'sku', 'name']),
        ]);
    }

    public function calculate(Request $request): JsonResponse
    {
        $validated = $this->validateCalculationRequest($request);

        $result = $this->calculator->calculate(
            $validated['product_lines'],
            $validated['syrup_batches'] ?? [],
        );

        return response()->json($result);
    }

    public function sendEmail(Request $request): JsonResponse
    {
        $validated = $this->validateCalculationRequest($request);

        $result = $this->calculator->calculate(
            $validated['product_lines'],
            $validated['syrup_batches'] ?? [],
        );

        $productos = collect($result['aggregated'])->map(fn (array $line) => [
            'codAje' => $line['cod_aje'],
            'codEmb' => $line['cod_emb'],
            'descripcion' => $line['description'],
            'um' => $line['um'],
            'cantidad' => $line['quantity'],
        ])->values()->all();

        Mail::to('roberto.canales.pe@ecaral.pe')->send(new ContactoMail($productos));

        return response()->json([
            'ok' => true,
            'message' => 'VTC enviado por correo correctamente.',
        ]);
    }

    /**
     * @return array{product_lines: array, syrup_batches?: array}
     */
    private function validateCalculationRequest(Request $request): array
    {
        return $request->validate([
            'product_lines' => 'required|array|min:1',
            'product_lines.*.product_id' => 'required|integer|exists:products,id',
            'product_lines.*.packages' => 'required|numeric|min:0.000001',
            'syrup_batches' => 'nullable|array',
            'syrup_batches.*.syrup_id' => 'required|integer|exists:syrups,id',
            'syrup_batches.*.batches' => 'required|numeric|min:0',
        ]);
    }
}
