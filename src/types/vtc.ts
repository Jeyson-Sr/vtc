export type SyrupSummary = {
  id: number;
  sku: string | null;
  name: string;
};

export type SyrupIngredient = {
  id: number;
  syrup_id: number;
  cod_aje: string;
  cod_emb: string;
  description: string;
  um: string;
  factor: number;
  is_active: boolean;
  substitute_of_id: number | null;
  sort_order: number;
};

export type Syrup = SyrupSummary & {
  notes: string | null;
  ingredients: SyrupIngredient[];
};

export type ProductIngredient = {
  id: number;
  product_id: number;
  cod_aje: string;
  cod_emb: string;
  description: string;
  um: string;
  factor: number;
  category: string | null;
  is_active: boolean;
  substitute_of_id: number | null;
  sort_order: number;
};

export type Product = {
  id: number;
  sku: string;
  name: string;
  type: 'envasado' | 'auxiliar';
  syrup_id: number | null;
  units_per_package: number;
  syrup_factor: number;
  water_factor: number;
  yield_factor: number;
  notes: string | null;
  syrup?: SyrupSummary | null;
  ingredients?: ProductIngredient[];
};

export type VtcLine = {
  cod_aje: string;
  cod_emb: string;
  description: string;
  um: string;
  quantity: number;
  source?: string;
};

export type VtcResult = {
  lines: VtcLine[];
  aggregated: Omit<VtcLine, 'source'>[];
  syrup_liters: Record<number, number>;
  meta: {
    product_lines: number;
    syrup_batches: number;
  };
};

export type ProductLineInput = {
  product_id: number;
  packages: number;
};

export type SyrupBatchInput = {
  syrup_id: number;
  batches: number;
};

export type ProductInput = {
  sku: string;
  name: string;
  type: 'envasado' | 'auxiliar';
  syrup_id: number | null;
  units_per_package: number;
  syrup_factor: number;
  water_factor: number;
  yield_factor: number;
  notes?: string | null;
};

export type ProductIngredientInput = {
  cod_aje: string;
  cod_emb: string;
  description: string;
  um: string;
  factor: number;
  category?: string | null;
  is_active?: boolean;
  substitute_of_id?: number | null;
  sort_order?: number;
};

export type SyrupInput = {
  sku?: string | null;
  name: string;
  notes?: string | null;
};

export type SyrupIngredientInput = {
  cod_aje: string;
  cod_emb: string;
  description: string;
  um: string;
  factor: number;
  is_active?: boolean;
  substitute_of_id?: number | null;
  sort_order?: number;
};

export const PACKAGING_CATEGORIES = [
  'preforma',
  'tapa',
  'etiqueta',
  'lamina',
  'stretch',
  'carton',
] as const;

export const PRODUCT_CATEGORIES = [
  'preforma',
  'tapa',
  'etiqueta',
  'lamina',
  'stretch',
  'carton',
  'otro',
] as const;
