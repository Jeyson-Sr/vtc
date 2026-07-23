<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductIngredient;
use App\Models\Syrup;

class VtcCalculator
{
    /**
     * @param  array<int, array{product_id: int, packages: float|int|string}>  $productLines
     * @param  array<int, array{syrup_id: int, batches: float|int|string}>  $syrupBatches
     * @return array{
     *     lines: list<array{cod_aje: string, cod_emb: string, description: string, um: string, quantity: float, source: string}>,
     *     aggregated: list<array{cod_aje: string, cod_emb: string, description: string, um: string, quantity: float}>,
     *     syrup_liters: array<int, float>,
     *     meta: array<string, mixed>
     * }
     */
    public function calculate(array $productLines, array $syrupBatches = []): array
    {
        $lines = [];
        $syrupLitersById = [];

        $productIds = collect($productLines)->pluck('product_id')->filter()->unique()->values();
        $products = Product::with(['activeIngredients', 'syrup'])
            ->whereIn('id', $productIds)
            ->get()
            ->keyBy('id');

        foreach ($productLines as $line) {
            $productId = (int) ($line['product_id'] ?? 0);
            $packages = (float) ($line['packages'] ?? 0);

            if ($productId <= 0 || $packages <= 0) {
                continue;
            }

            $product = $products->get($productId);
            if (! $product) {
                continue;
            }

            foreach ($product->activeIngredients as $ingredient) {
                $quantity = $this->calculatePackagingQuantity($product, $ingredient, $packages);

                $lines[] = $this->makeLine(
                    $ingredient->cod_aje,
                    $ingredient->cod_emb,
                    $ingredient->description,
                    $ingredient->um,
                    $quantity,
                    $product->name,
                );
            }

            if ($product->syrup_id && $product->syrup_factor > 0) {
                $liters = $packages * (float) $product->syrup_factor;
                $syrupLitersById[$product->syrup_id] = ($syrupLitersById[$product->syrup_id] ?? 0) + $liters;
            }

            if ($product->water_factor > 0) {
                $waterQty = $packages * (float) $product->water_factor;
                $lines[] = $this->makeLine(
                    '54234',
                    'AX-01',
                    'AGUA CRUDA',
                    'LT',
                    $waterQty,
                    $product->name.' (agua)',
                );
            }
        }

        $syrupBatchMap = collect($syrupBatches)
            ->filter(fn (array $row) => ($row['batches'] ?? 0) > 0)
            ->keyBy(fn (array $row) => (int) $row['syrup_id']);

        $syrupIds = $syrupBatchMap->keys()
            ->merge(array_keys($syrupLitersById))
            ->unique()
            ->values();

        $syrups = Syrup::with('activeIngredients')
            ->whereIn('id', $syrupIds)
            ->get()
            ->keyBy('id');

        foreach ($syrupIds as $syrupId) {
            $syrup = $syrups->get($syrupId);
            if (! $syrup) {
                continue;
            }

            $batches = (float) ($syrupBatchMap->get($syrupId)['batches'] ?? 0);
            if ($batches <= 0) {
                continue;
            }

            foreach ($syrup->activeIngredients as $ingredient) {
                $quantity = $batches * (float) $ingredient->factor;

                $lines[] = $this->makeLine(
                    $ingredient->cod_aje,
                    $ingredient->cod_emb,
                    $ingredient->description,
                    $ingredient->um,
                    $quantity,
                    $syrup->name,
                );
            }
        }

        return [
            'lines' => $lines,
            'aggregated' => $this->aggregateLines($lines),
            'syrup_liters' => $syrupLitersById,
            'meta' => [
                'product_lines' => count($productLines),
                'syrup_batches' => $syrupBatchMap->count(),
            ],
        ];
    }

    private function calculatePackagingQuantity(Product $product, ProductIngredient $ingredient, float $packages): float
    {
        $quantity = $packages * (float) $ingredient->factor;

        if (
            $product->type === Product::TYPE_ENVASADO
            && (float) $product->yield_factor > 0
            && $ingredient->isPackagingMaterial()
        ) {
            $quantity /= (float) $product->yield_factor;
        }

        return round($quantity, 6);
    }

    /**
     * @return array{cod_aje: string, cod_emb: string, description: string, um: string, quantity: float, source: string}
     */
    private function makeLine(
        string $codAje,
        string $codEmb,
        string $description,
        string $um,
        float $quantity,
        string $source,
    ): array {
        return [
            'cod_aje' => $codAje,
            'cod_emb' => $codEmb,
            'description' => $description,
            'um' => $um,
            'quantity' => round($quantity, 6),
            'source' => $source,
        ];
    }

    /**
     * @param  list<array{cod_aje: string, cod_emb: string, description: string, um: string, quantity: float, source: string}>  $lines
     * @return list<array{cod_aje: string, cod_emb: string, description: string, um: string, quantity: float}>
     */
    private function aggregateLines(array $lines): array
    {
        $aggregated = [];

        foreach ($lines as $line) {
            $key = $line['cod_aje'].'|'.$line['cod_emb'];

            if (! isset($aggregated[$key])) {
                $aggregated[$key] = [
                    'cod_aje' => $line['cod_aje'],
                    'cod_emb' => $line['cod_emb'],
                    'description' => $line['description'],
                    'um' => $line['um'],
                    'quantity' => 0,
                ];
            }

            $aggregated[$key]['quantity'] = round($aggregated[$key]['quantity'] + $line['quantity'], 6);
        }

        return array_values($aggregated);
    }
}
