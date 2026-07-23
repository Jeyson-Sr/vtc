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
    factor: string | number;
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
    factor: string | number;
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
    units_per_package: string | number;
    syrup_factor: string | number;
    water_factor: string | number;
    yield_factor: string | number;
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
    aggregated: VtcLine[];
    syrup_liters: Record<string, number>;
    meta: Record<string, unknown>;
};
