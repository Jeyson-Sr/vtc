import type {
  Product,
  ProductIngredient,
  ProductLineInput,
  Syrup,
  SyrupBatchInput,
  SyrupIngredient,
  VtcLine,
  VtcResult,
} from '@/types/vtc';
import { PACKAGING_CATEGORIES } from '@/types/vtc';

function isPackagingMaterial(ingredient: ProductIngredient): boolean {
  if (
    ingredient.category &&
    (PACKAGING_CATEGORIES as readonly string[]).includes(ingredient.category)
  ) {
    return true;
  }
  return ingredient.cod_emb.startsWith('EMB-');
}

function makeLine(
  codAje: string,
  codEmb: string,
  description: string,
  um: string,
  quantity: number,
  source: string,
): VtcLine {
  return {
    cod_aje: codAje,
    cod_emb: codEmb,
    description,
    um,
    quantity: round6(quantity),
    source,
  };
}

function round6(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function calculatePackagingQuantity(
  product: Product,
  ingredient: ProductIngredient,
  packages: number,
): number {
  let quantity = packages * ingredient.factor;

  if (
    product.type === 'envasado' &&
    product.yield_factor > 0 &&
    isPackagingMaterial(ingredient)
  ) {
    quantity /= product.yield_factor;
  }

  return round6(quantity);
}

function aggregateLines(lines: VtcLine[]): Omit<VtcLine, 'source'>[] {
  const map = new Map<string, Omit<VtcLine, 'source'>>();

  for (const line of lines) {
    const key = `${line.cod_aje}|${line.cod_emb}`;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        cod_aje: line.cod_aje,
        cod_emb: line.cod_emb,
        description: line.description,
        um: line.um,
        quantity: line.quantity,
      });
    } else {
      existing.quantity = round6(existing.quantity + line.quantity);
    }
  }

  return Array.from(map.values());
}

export function calculateVtc(
  products: Product[],
  syrups: Syrup[],
  productLines: ProductLineInput[],
  syrupBatches: SyrupBatchInput[] = [],
): VtcResult {
  const lines: VtcLine[] = [];
  const syrupLitersById: Record<number, number> = {};
  const productsById = new Map(products.map((p) => [p.id, p]));
  const syrupsById = new Map(syrups.map((s) => [s.id, s]));

  for (const line of productLines) {
    const packages = Number(line.packages);
    const product = productsById.get(line.product_id);
    if (!product || packages <= 0) continue;

    const ingredients = (product.ingredients ?? []).filter((i) => i.is_active);
    for (const ingredient of ingredients) {
      const quantity = calculatePackagingQuantity(product, ingredient, packages);
      lines.push(
        makeLine(
          ingredient.cod_aje,
          ingredient.cod_emb,
          ingredient.description,
          ingredient.um,
          quantity,
          product.name,
        ),
      );
    }

    if (product.syrup_id && product.syrup_factor > 0) {
      const liters = packages * product.syrup_factor;
      syrupLitersById[product.syrup_id] =
        (syrupLitersById[product.syrup_id] ?? 0) + liters;
    }

    if (product.water_factor > 0) {
      lines.push(
        makeLine(
          '54234',
          'AX-01',
          'AGUA CRUDA',
          'LT',
          packages * product.water_factor,
          `${product.name} (agua)`,
        ),
      );
    }
  }

  const batchMap = new Map<number, number>();
  for (const row of syrupBatches) {
    const batches = Number(row.batches);
    if (batches > 0) {
      batchMap.set(row.syrup_id, batches);
    }
  }

  const syrupIds = new Set<number>([
    ...batchMap.keys(),
    ...Object.keys(syrupLitersById).map(Number),
  ]);

  for (const syrupId of syrupIds) {
    const syrup = syrupsById.get(syrupId);
    if (!syrup) continue;

    const batches = batchMap.get(syrupId) ?? 0;
    if (batches <= 0) continue;

    const ingredients = (syrup.ingredients ?? []).filter(
      (i: SyrupIngredient) => i.is_active,
    );
    for (const ingredient of ingredients) {
      lines.push(
        makeLine(
          ingredient.cod_aje,
          ingredient.cod_emb,
          ingredient.description,
          ingredient.um,
          batches * ingredient.factor,
          syrup.name,
        ),
      );
    }
  }

  return {
    lines,
    aggregated: aggregateLines(lines),
    syrup_liters: syrupLitersById,
    meta: {
      product_lines: productLines.length,
      syrup_batches: batchMap.size,
    },
  };
}
