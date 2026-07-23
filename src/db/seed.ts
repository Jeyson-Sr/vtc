import type { Database } from 'sql.js';

type Insumo = {
  codAje: string;
  codEmb: string;
  descripcion: string;
  um: string;
  cantidad: number;
};

type FormulaRow = {
  sku: string;
  nombre: string;
  insumos: Insumo[];
};

const jarabes: FormulaRow[] = [
  {
    sku: '3000082',
    nombre: 'Jarabe Sporade',
    insumos: [
      { codAje: '50890', codEmb: 'E-01', descripcion: 'KIT CONCENTRADO PARA BEBIDA CON ADICIÓN DE ELECTROLITOS TROPICA', um: 'UN', cantidad: 1 },
      { codAje: '122', codEmb: 'E-01', descripcion: 'CITRATO DE SODIO', um: 'KG', cantidad: 12.5 },
      { codAje: '5299', codEmb: 'E-01', descripcion: 'CLORURO DE SODIO QP', um: 'KG', cantidad: 12.5 },
      { codAje: '118', codEmb: 'E-01', descripcion: 'ACIDO CITRICO', um: 'KG', cantidad: 66.5 },
      { codAje: '5206', codEmb: 'E-01', descripcion: 'DEXTROSA', um: 'KG', cantidad: 212.5 },
    ],
  },
  {
    sku: '3000084',
    nombre: 'Jarabe Mandarina',
    insumos: [
      { codAje: '50891', codEmb: 'E-01', descripcion: 'BASE PARA BEBIDA CON ADICIÓN DE ELECTROLITOS S 49599', um: 'UN', cantidad: 1 },
      { codAje: '20446', codEmb: 'E-01', descripcion: 'EMULSION MANDARINA SC242290', um: 'KG', cantidad: 23.1 },
      { codAje: '122', codEmb: 'E-01', descripcion: 'CITRATO DE SODIO', um: 'KG', cantidad: 18.75 },
      { codAje: '5299', codEmb: 'E-01', descripcion: 'CLORURO DE SODIO QP', um: 'KG', cantidad: 12.5 },
      { codAje: '118', codEmb: 'E-01', descripcion: 'ACIDO CITRICO', um: 'KG', cantidad: 52 },
      { codAje: '5206', codEmb: 'E-01', descripcion: 'DEXTROSA', um: 'KG', cantidad: 212.5 },
    ],
  },
  {
    sku: '3000374',
    nombre: 'Jarabe Sporade Apple Ice Sin Azúcar',
    insumos: [
      { codAje: '54469', codEmb: 'E-01', descripcion: 'BASE PARA BEBIDA CON ADICIÓN DE ELECTROLITOS APPLE ICE SIN AZÚC', um: 'UN', cantidad: 2 },
      { codAje: '54468', codEmb: 'E-01', descripcion: 'SABOR APPLE ICE 28284', um: 'KG', cantidad: 10 },
      { codAje: '122', codEmb: 'E-01', descripcion: 'CITRATO DE SODIO', um: 'KG', cantidad: 12.5 },
      { codAje: '118', codEmb: 'E-01', descripcion: 'ACIDO CITRICO', um: 'KG', cantidad: 37.5 },
    ],
  },
  {
    sku: '3000266',
    nombre: 'Jarabe Sporade Uva',
    insumos: [
      { codAje: '53332', codEmb: 'E-01', descripcion: 'BASE PARA BEBIDA CON ADICIÓN DE ELECTROLITOS UVA S 49815', um: 'UN', cantidad: 1 },
      { codAje: '53331', codEmb: 'E-01', descripcion: 'SABOR UVA SN 469142', um: 'KG', cantidad: 9.5 },
      { codAje: '122', codEmb: 'E-01', descripcion: 'CITRATO DE SODIO', um: 'KG', cantidad: 18.75 },
      { codAje: '5299', codEmb: 'E-01', descripcion: 'CLORURO DE SODIO QP', um: 'KG', cantidad: 12.5 },
      { codAje: '118', codEmb: 'E-01', descripcion: 'ACIDO CITRICO', um: 'KG', cantidad: 55 },
      { codAje: '5206', codEmb: 'E-01', descripcion: 'DEXTROSA', um: 'KG', cantidad: 212.5 },
    ],
  },
  {
    sku: '3000086',
    nombre: 'Jarabe Sporade Blueberry',
    insumos: [
      { codAje: '50891', codEmb: 'E-01', descripcion: 'BASE PARA BEBIDA CON ADICIÓN DE ELECTROLITOS S 49599', um: 'UN', cantidad: 1 },
      { codAje: '48035', codEmb: 'E-01', descripcion: 'EMULSION BLUEBERRY EM 73174', um: 'KG', cantidad: 10.26 },
      { codAje: '122', codEmb: 'E-01', descripcion: 'CITRATO DE SODIO', um: 'KG', cantidad: 18.75 },
      { codAje: '118', codEmb: 'E-01', descripcion: 'ACIDO CITRICO', um: 'KG', cantidad: 50 },
      { codAje: '5206', codEmb: 'E-01', descripcion: 'DEXTROSA', um: 'KG', cantidad: 212.5 },
      { codAje: '5299', codEmb: 'E-01', descripcion: 'CLORURO DE SODIO QP', um: 'KG', cantidad: 12.5 },
    ],
  },
];

const envasado: FormulaRow[] = [
  {
    sku: '599371',
    nombre: 'Sporade Tropical 500ml L7',
    insumos: [
      { codAje: '55630', codEmb: 'EMB-01', descripcion: 'PREFORMA ASEPTICA 17 GRS CRISTAL (1881) SAN MIGUEL', um: 'UND', cantidad: 12 },
      { codAje: '55860', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 32 MM VERDE ASEPTICA (SAN MIGUEL)', um: 'UND', cantidad: 12 },
      { codAje: '57166', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE TROPICAL PET 500 ML UNIF - EMB. CARAL', um: 'UND', cantidad: 12 },
      { codAje: '56124', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 780 MM X 50µm', um: 'UND', cantidad: 0.012128 },
      { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20', um: 'UND', cantidad: 0.0012 },
      { codAje: '56123', codEmb: 'EMB-03', descripcion: 'SEPARADOR ONE WAY ONDA 111E - DIMENSION DE 0.98 X 1.18 MTS', um: 'UND', cantidad: 0.041667 },
    ],
  },
  {
    sku: '499371',
    nombre: 'Sporade Tropical 500ml L4',
    insumos: [
      { codAje: '54083', codEmb: 'EMB-01', descripcion: 'PREFORMA PET 24 GRS CRISTAL HF (SAN MIGUEL) - UNIVERSAL', um: 'UND', cantidad: 12 },
      { codAje: '37582', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 33 MM VERDE ASEPTICA (SAN MIGUEL)', um: 'UND', cantidad: 12 },
      { codAje: '57166', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE TROPICAL PET 500 ML UNIF - EMB. CARAL', um: 'UND', cantidad: 12 },
      { codAje: '51890', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 410 MM X 40µm', um: 'UND', cantidad: 0.012127 },
      { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20', um: 'UND', cantidad: 0.0012 },
      { codAje: '23961', codEmb: 'EMB-03', descripcion: 'CARTON SEPARADOR PARA ESTIBA', um: 'UND', cantidad: 0.0417 },
    ],
  },
  {
    sku: '499370',
    nombre: 'Sporade Mandarina 500ml L4',
    insumos: [
      { codAje: '54083', codEmb: 'EMB-01', descripcion: 'PREFORMA PET 24 GRS CRISTAL HF (SAN MIGUEL) - UNIVERSAL', um: 'UND', cantidad: 12 },
      { codAje: '37582', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 33 MM VERDE ASEPTICA (SAN MIGUEL)', um: 'UND', cantidad: 12 },
      { codAje: '57168', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE MANDARINA PET 500 ML UNIF - EMB.CARAL', um: 'UND', cantidad: 12 },
      { codAje: '51890', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 410 MM X 40µm', um: 'UND', cantidad: 0.012127 },
      { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20', um: 'UND', cantidad: 0.001562 },
      { codAje: '23961', codEmb: 'EMB-03', descripcion: 'CARTON SEPARADOR PARA ESTIBA', um: 'UND', cantidad: 0.046875 },
    ],
  },
  {
    sku: '599370',
    nombre: 'Sporade Mandarina 500ml L7',
    insumos: [
      { codAje: '55630', codEmb: 'EMB-01', descripcion: 'PREFORMA ASEPTICA 17 GRS CRISTAL (1881) SAN MIGUEL', um: 'UND', cantidad: 12 },
      { codAje: '55860', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 32 MM VERDE ASEPTICA (SAN MIGUEL)', um: 'UND', cantidad: 12 },
      { codAje: '57168', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE MANDARINA PET 500 ML UNIF - EMB.CARAL', um: 'UND', cantidad: 12 },
      { codAje: '56124', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 780 MM X 50µm', um: 'UND', cantidad: 0.016128 },
      { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20', um: 'UND', cantidad: 0.00336 },
      { codAje: '56123', codEmb: 'EMB-03', descripcion: 'SEPARADOR ONE WAY ONDA 111E - DIMENSION DE 0.98 X 1.18 MTS', um: 'UND', cantidad: 0.041667 },
    ],
  },
  {
    sku: '522439',
    nombre: 'Sporade Apple Light 500ml',
    insumos: [
      { codAje: '54083', codEmb: 'EMB-01', descripcion: 'PREFORMA PET 24 GRS CRISTAL HF (SAN MIGUEL) - UNIVERSAL', um: 'UND', cantidad: 12 },
      { codAje: '54684', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 33 MM NEGRO HF (SAN MIGUEL)', um: 'UND', cantidad: 12 },
      { codAje: '57170', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE APPLE LIGHT PET 500 ML UNIF - EMB. CARAL', um: 'UND', cantidad: 12 },
      { codAje: '51890', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 410 MM X 40µm', um: 'UND', cantidad: 0.015151 },
      { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20', um: 'UND', cantidad: 0.001563 },
      { codAje: '23961', codEmb: 'EMB-03', descripcion: 'CARTON SEPARADOR PARA ESTIBA', um: 'UND', cantidad: 0.046875 },
    ],
  },
  {
    sku: '523493',
    nombre: 'Sporade Tropical 625ml  (Sport Cap)',
    insumos: [
      { codAje: '54083', codEmb: 'EMB-01', descripcion: 'PREFORMA PET 24 GRS CRISTAL HF (SAN MIGUEL) - UNIVERSAL', um: 'UND', cantidad: 12 },
      { codAje: '55975', codEmb: 'EMB-02', descripcion: 'TAPA SPORT CAP 33 MM VERDE (ZELLER MEX)', um: 'UND', cantidad: 12 },
      { codAje: '57410', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE TROPICAL 625 ML SPORTCAP - EMB CARAL - MOD', um: 'UND', cantidad: 12 },
      { codAje: '51890', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 410 MM X 40 µ', um: 'UND', cantidad: 0.016128 },
      { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20', um: 'UND', cantidad: 0.00336 },
      { codAje: '23961', codEmb: 'EMB-03', descripcion: 'CARTON SEPARADOR PARA ESTIBA', um: 'UND', cantidad: 0.035714 },
    ],
  },
  {
    sku: '421942',
    nombre: 'Sporade Uva 500ml',
    insumos: [
      { codAje: '55630', codEmb: 'EMB-01', descripcion: 'PREFORMA ASEPTICA 17 GRS CRISTAL (1881) SAN MIGUEL', um: 'UND', cantidad: 12 },
      { codAje: '37582', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 32 MM VERDE ASEPTICA (SAN MIGUEL)', um: 'UND', cantidad: 12 },
      { codAje: '57169', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE UVA PET 500 ML UNIF - EMB. CARAL', um: 'UND', cantidad: 12 },
      { codAje: '56124', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 780 MM X 50µm', um: 'UND', cantidad: 0.016128 },
      { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20', um: 'UND', cantidad: 0.00336 },
      { codAje: '23961', codEmb: 'EMB-03', descripcion: 'CARTON SEPARADOR PARA ESTIBA', um: 'UND', cantidad: 0.041667 },
    ],
  },
  {
    sku: '499378',
    nombre: 'Sporade Blueberry 500ml L4',
    insumos: [
      { codAje: '54083', codEmb: 'EMB-01', descripcion: 'PREFORMA PET 24 GRS CRISTAL HF (SAN MIGUEL) - UNIVERSAL', um: 'UND', cantidad: 12 },
      { codAje: '37582', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 33 MM VERDE ASEPTICA (SAN MIGUEL)', um: 'UND', cantidad: 12 },
      { codAje: '57167', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE BLUEBERRY PET 500 ML UNIF - EMB. CARAL', um: 'UND', cantidad: 12 },
      { codAje: '51890', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 410 MM X 40µm', um: 'UND', cantidad: 0.012127 },
      { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20', um: 'UND', cantidad: 0.0012 },
      { codAje: '23961', codEmb: 'EMB-03', descripcion: 'CARTON SEPARADOR PARA ESTIBA', um: 'UND', cantidad: 0.041667 },
    ],
  },
  {
    sku: '599378',
    nombre: 'Sporade Blueberry 500ml L7',
    insumos: [
      { codAje: '55630', codEmb: 'EMB-01', descripcion: 'PREFORMA ASEPTICA 17 GRS CRISTAL (1881) SAN MIGUEL', um: 'UND', cantidad: 12 },
      { codAje: '55860', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 32 MM VERDE ASEPTICA (SAN MIGUEL)', um: 'UND', cantidad: 12 },
      { codAje: '57167', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE BLUEBERRY PET 500 ML UNIF - EMB. CARAL', um: 'UND', cantidad: 12 },
      { codAje: '56124', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 780 MM X 50µm', um: 'UND', cantidad: 0.016128 },
      { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20', um: 'UND', cantidad: 0.00336 },
      { codAje: '56123', codEmb: 'EMB-03', descripcion: 'SEPARADOR ONE WAY ONDA 111E - DIMENSION DE 0.98 X 1.18 MTS', um: 'UND', cantidad: 0.041667 },
    ],
  },
  {
    sku: '499376',
    nombre: 'Sporade Tropical 1000ml',
    insumos: [
      { codAje: '50111', codEmb: 'EMB-01', descripcion: 'PREFORMA PET 38.1 GRS CRISTAL HF (SAN MIGUEL)', um: 'UND', cantidad: 6 },
      { codAje: '37582', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 33 MM VERDE HF (SAN MIGUEL)', um: 'UND', cantidad: 6 },
      { codAje: '57178', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE TROPICAL 1000 ML - EMB. CARAL', um: 'UND', cantidad: 6 },
      { codAje: '51890', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 410 MM X 40 µ', um: 'UND', cantidad: 0.013699 },
      { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20', um: 'UND', cantidad: 0.001329 },
      { codAje: '23961', codEmb: 'EMB-03', descripcion: 'CARTON SEPARADOR PARA ESTIBA', um: 'UND', cantidad: 0.041659 },
    ],
  },
  {
    sku: '421790',
    nombre: 'Sporade Tropical 1500ml',
    insumos: [
      { codAje: '38151', codEmb: 'EMB-01', descripcion: 'PREFORMA PET 58 GRS CRISTAL HF', um: 'UND', cantidad: 6 },
      { codAje: '37582', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 33 MM VERDE HF (SAN MIGUEL)', um: 'UND', cantidad: 6 },
      { codAje: '57179', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE TROPICAL 1500 ML - EMB. CARAL', um: 'UND', cantidad: 6 },
      { codAje: '49312', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 410 MM X 50 µ (BOBINA 30 KG.)', um: 'UND', cantidad: 0.022509 },
      { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20', um: 'UND', cantidad: 0.001817 },
      { codAje: '23961', codEmb: 'EMB-03', descripcion: 'CARTON SEPARADOR PARA ESTIBA', um: 'UND', cantidad: 0.045455 },
    ],
  },
  {
    sku: '422908',
    nombre: 'Sporade Blueberry 1500ml',
    insumos: [
      { codAje: '38151', codEmb: 'EMB-01', descripcion: 'PREFORMA PET 58 GRS CRISTAL HF', um: 'UND', cantidad: 6 },
      { codAje: '37582', codEmb: 'EMB-02', descripcion: 'TAPA PLANA 33 MM VERDE HF (SAN MIGUEL)', um: 'UND', cantidad: 6 },
      { codAje: '55762', codEmb: 'EMB-03', descripcion: 'ETIQUETA SPORADE BLUEBERRY PET NO RETORNABLE 1500 ML UNIF', um: 'UND', cantidad: 6 },
      { codAje: '49312', codEmb: 'EMB-03', descripcion: 'LAMINA TERMOCONTRAIBLE 410 MM X 50 µ (BOBINA 30 KG.)', um: 'UND', cantidad: 0.022509 },
      { codAje: '57347', codEmb: 'EMB-03', descripcion: 'STRETCH DE ALTO RENDIMIENTO 20', um: 'UND', cantidad: 0.001817 },
      { codAje: '23961', codEmb: 'EMB-03', descripcion: 'CARTON SEPARADOR PARA ESTIBA', um: 'UND', cantidad: 0.045455 },
    ],
  },
];

const auxiliares: FormulaRow[] = [
  {
    sku: '53721',
    nombre: 'AZUCAR BIG BAG',
    insumos: [
      { codAje: '53721', codEmb: 'AX-01', descripcion: 'AZUCAR REFINADA NACIONAL BIG BAG', um: 'kg', cantidad: 1 },
    ],
  },
  {
    sku: '16543',
    nombre: 'AZUCAR SACOS',
    insumos: [
      { codAje: '16543', codEmb: 'AX-01', descripcion: 'AZUCAR REFINADA ESPECIAL IMPORTADA', um: 'kg', cantidad: 1 },
    ],
  },
  {
    sku: '54234',
    nombre: 'AGUA CRUDA',
    insumos: [
      { codAje: '54234', codEmb: 'AX-01', descripcion: 'AGUA CRUDA', um: 'LT', cantidad: 1 },
    ],
  },
];

function syrupSkuForProduct(name: string): string | null {
  if (name.includes('Mandarina')) return '3000084';
  if (name.includes('Apple')) return '3000374';
  if (name.includes('Uva')) return '3000266';
  if (name.includes('Blueberry')) return '3000086';
  if (name.includes('Tropical') || name.includes('Sporade')) return '3000082';
  return null;
}

function unitsPerPackage(insumos: Insumo[]): number {
  const emb = insumos.find((i) => i.codEmb === 'EMB-01');
  return emb ? emb.cantidad : 1;
}

function syrupFactorForProduct(name: string, insumos: Insumo[]): number {
  const units = unitsPerPackage(insumos);
  const match = name.match(/(\d+)\s*ml/i);
  if (match) {
    return Math.round(units * (Number(match[1]) / 1000) * 1_000_000) / 1_000_000;
  }
  return Math.round(units * 0.5 * 1_000_000) / 1_000_000;
}

function inferCategory(codEmb: string, description: string): string {
  if (codEmb === 'EMB-01') return 'preforma';
  if (codEmb === 'EMB-02') return 'tapa';
  const upper = description.toUpperCase();
  if (upper.includes('ETIQUETA')) return 'etiqueta';
  if (upper.includes('LAMINA')) return 'lamina';
  if (upper.includes('STRETCH')) return 'stretch';
  if (upper.includes('CARTON') || upper.includes('SEPARADOR')) return 'carton';
  return 'otro';
}

function lastInsertId(db: Database): number {
  const result = db.exec('SELECT last_insert_rowid() AS id');
  return Number(result[0]?.values[0]?.[0] ?? 0);
}

export function seedDatabase(db: Database): void {
  const syrupIds: Record<string, number> = {};

  for (const row of jarabes) {
    db.run('INSERT INTO syrups (sku, name) VALUES (?, ?)', [row.sku, row.nombre.trim()]);
    const syrupId = lastInsertId(db);
    syrupIds[row.sku] = syrupId;

    row.insumos.forEach((insumo, i) => {
      db.run(
        `INSERT INTO syrup_ingredients
          (syrup_id, cod_aje, cod_emb, description, um, factor, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [syrupId, insumo.codAje, insumo.codEmb, insumo.descripcion, insumo.um, insumo.cantidad, i],
      );
    });
  }

  for (const row of envasado) {
    const syrupSku = syrupSkuForProduct(row.nombre);
    const syrupFactor = syrupFactorForProduct(row.nombre, row.insumos);
    const waterFactor = syrupFactor > 0 ? syrupFactor * 4 : 0;
    const syrupId = syrupSku ? (syrupIds[syrupSku] ?? null) : null;

    db.run(
      `INSERT INTO products
        (sku, name, type, syrup_id, units_per_package, syrup_factor, water_factor, yield_factor)
       VALUES (?, ?, 'envasado', ?, ?, ?, ?, 0.997)`,
      [
        row.sku,
        row.nombre,
        syrupId,
        unitsPerPackage(row.insumos),
        syrupFactor,
        waterFactor,
      ],
    );
    const productId = lastInsertId(db);

    row.insumos.forEach((insumo, i) => {
      db.run(
        `INSERT INTO product_ingredients
          (product_id, cod_aje, cod_emb, description, um, factor, category, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          productId,
          insumo.codAje,
          insumo.codEmb,
          insumo.descripcion,
          insumo.um,
          insumo.cantidad,
          inferCategory(insumo.codEmb, insumo.descripcion),
          i,
        ],
      );
    });
  }

  for (const row of auxiliares) {
    db.run(
      `INSERT INTO products
        (sku, name, type, units_per_package, syrup_factor, water_factor, yield_factor)
       VALUES (?, ?, 'auxiliar', 1, 0, 0, 0)`,
      [row.sku, row.nombre],
    );
    const productId = lastInsertId(db);

    row.insumos.forEach((insumo, i) => {
      db.run(
        `INSERT INTO product_ingredients
          (product_id, cod_aje, cod_emb, description, um, factor, category, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, 'otro', ?)`,
        [
          productId,
          insumo.codAje,
          insumo.codEmb,
          insumo.descripcion,
          insumo.um,
          insumo.cantidad,
          i,
        ],
      );
    });
  }
}
