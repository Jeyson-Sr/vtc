// types.ts
export interface Insumo {
  codAje: string;
  codEmb: string;
  descripcion: string;
  um: string;
  cantidad: number;
}

export interface Producto {
  sku: string;
  nombre: string;
  insumos: Insumo[];
}