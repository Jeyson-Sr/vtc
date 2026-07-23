import { getDatabase, persistDatabase } from '@/db/database';
import type {
  Product,
  ProductIngredient,
  ProductIngredientInput,
  ProductInput,
  Syrup,
  SyrupIngredient,
  SyrupIngredientInput,
  SyrupInput,
  SyrupSummary,
} from '@/types/vtc';

function rowsFrom<T>(sql: string, params: unknown[] = []): T[] {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  stmt.bind(params as never[]);
  const rows: T[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return rows;
}

function lastId(): number {
  const row = rowsFrom<{ id: number }>('SELECT last_insert_rowid() AS id')[0];
  return row?.id ?? 0;
}

function mapBool<T extends { is_active: number | boolean }>(
  row: T,
): T & { is_active: boolean } {
  return { ...row, is_active: Boolean(row.is_active) };
}

export function listSyrupSummaries(): SyrupSummary[] {
  return rowsFrom<SyrupSummary>(
    'SELECT id, sku, name FROM syrups ORDER BY name ASC',
  );
}

export function listSyrups(): Syrup[] {
  const syrups = rowsFrom<Omit<Syrup, 'ingredients'>>(
    'SELECT id, sku, name, notes FROM syrups ORDER BY name ASC',
  );

  return syrups.map((syrup) => ({
    ...syrup,
    ingredients: listSyrupIngredients(syrup.id),
  }));
}

export function getSyrup(id: number): Syrup | null {
  const syrup = rowsFrom<Omit<Syrup, 'ingredients'>>(
    'SELECT id, sku, name, notes FROM syrups WHERE id = ?',
    [id],
  )[0];
  if (!syrup) return null;
  return { ...syrup, ingredients: listSyrupIngredients(id) };
}

export function listSyrupIngredients(syrupId: number): SyrupIngredient[] {
  return rowsFrom<SyrupIngredient & { is_active: number }>(
    `SELECT id, syrup_id, cod_aje, cod_emb, description, um, factor,
            is_active, substitute_of_id, sort_order
     FROM syrup_ingredients
     WHERE syrup_id = ?
     ORDER BY sort_order ASC, id ASC`,
    [syrupId],
  ).map(mapBool);
}

export function createSyrup(input: SyrupInput): number {
  getDatabase().run('INSERT INTO syrups (sku, name, notes) VALUES (?, ?, ?)', [
    input.sku ?? null,
    input.name,
    input.notes ?? null,
  ]);
  const id = lastId();
  persistDatabase();
  return id;
}

export function updateSyrup(id: number, input: SyrupInput): void {
  getDatabase().run(
    'UPDATE syrups SET sku = ?, name = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [input.sku ?? null, input.name, input.notes ?? null, id],
  );
  persistDatabase();
}

export function deleteSyrup(id: number): void {
  const db = getDatabase();
  db.run('UPDATE products SET syrup_id = NULL WHERE syrup_id = ?', [id]);
  db.run('DELETE FROM syrup_ingredients WHERE syrup_id = ?', [id]);
  db.run('DELETE FROM syrups WHERE id = ?', [id]);
  persistDatabase();
}

export function createSyrupIngredient(
  syrupId: number,
  input: SyrupIngredientInput,
): number {
  const sort =
    input.sort_order ??
    rowsFrom<{ c: number }>(
      'SELECT COUNT(*) AS c FROM syrup_ingredients WHERE syrup_id = ?',
      [syrupId],
    )[0]?.c ??
    0;

  getDatabase().run(
    `INSERT INTO syrup_ingredients
      (syrup_id, cod_aje, cod_emb, description, um, factor, is_active, substitute_of_id, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      syrupId,
      input.cod_aje,
      input.cod_emb,
      input.description,
      input.um,
      input.factor,
      input.is_active === false ? 0 : 1,
      input.substitute_of_id ?? null,
      sort,
    ],
  );
  const id = lastId();
  persistDatabase();
  return id;
}

export function updateSyrupIngredient(
  id: number,
  input: SyrupIngredientInput,
): void {
  getDatabase().run(
    `UPDATE syrup_ingredients SET
      cod_aje = ?, cod_emb = ?, description = ?, um = ?, factor = ?,
      is_active = ?, substitute_of_id = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      input.cod_aje,
      input.cod_emb,
      input.description,
      input.um,
      input.factor,
      input.is_active === false ? 0 : 1,
      input.substitute_of_id ?? null,
      id,
    ],
  );
  persistDatabase();
}

export function deleteSyrupIngredient(id: number): void {
  const db = getDatabase();
  db.run(
    'UPDATE syrup_ingredients SET substitute_of_id = NULL WHERE substitute_of_id = ?',
    [id],
  );
  db.run('DELETE FROM syrup_ingredients WHERE id = ?', [id]);
  persistDatabase();
}

export function listProducts(): Product[] {
  const products = rowsFrom<
    Product & { syrup_name?: string | null; syrup_sku?: string | null }
  >(
    `SELECT p.id, p.sku, p.name, p.type, p.syrup_id, p.units_per_package,
            p.syrup_factor, p.water_factor, p.yield_factor, p.notes,
            s.name AS syrup_name, s.sku AS syrup_sku
     FROM products p
     LEFT JOIN syrups s ON s.id = p.syrup_id
     ORDER BY p.type ASC, p.name ASC`,
  );

  return products.map((p) => ({
    id: p.id,
    sku: p.sku,
    name: p.name,
    type: p.type,
    syrup_id: p.syrup_id,
    units_per_package: p.units_per_package,
    syrup_factor: p.syrup_factor,
    water_factor: p.water_factor,
    yield_factor: p.yield_factor,
    notes: p.notes,
    syrup: p.syrup_id
      ? {
          id: p.syrup_id,
          sku: p.syrup_sku ?? null,
          name: p.syrup_name ?? '',
        }
      : null,
    ingredients: listProductIngredients(p.id),
  }));
}

export function listProductIngredients(productId: number): ProductIngredient[] {
  return rowsFrom<ProductIngredient & { is_active: number }>(
    `SELECT id, product_id, cod_aje, cod_emb, description, um, factor,
            category, is_active, substitute_of_id, sort_order
     FROM product_ingredients
     WHERE product_id = ?
     ORDER BY sort_order ASC, id ASC`,
    [productId],
  ).map(mapBool);
}

export function createProduct(input: ProductInput): number {
  getDatabase().run(
    `INSERT INTO products
      (sku, name, type, syrup_id, units_per_package, syrup_factor, water_factor, yield_factor, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.sku,
      input.name,
      input.type,
      input.syrup_id,
      input.units_per_package,
      input.syrup_factor,
      input.water_factor,
      input.yield_factor,
      input.notes ?? null,
    ],
  );
  const id = lastId();
  persistDatabase();
  return id;
}

export function updateProduct(id: number, input: ProductInput): void {
  getDatabase().run(
    `UPDATE products SET
      sku = ?, name = ?, type = ?, syrup_id = ?, units_per_package = ?,
      syrup_factor = ?, water_factor = ?, yield_factor = ?, notes = ?,
      updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      input.sku,
      input.name,
      input.type,
      input.syrup_id,
      input.units_per_package,
      input.syrup_factor,
      input.water_factor,
      input.yield_factor,
      input.notes ?? null,
      id,
    ],
  );
  persistDatabase();
}

export function deleteProduct(id: number): void {
  const db = getDatabase();
  db.run('DELETE FROM product_ingredients WHERE product_id = ?', [id]);
  db.run('DELETE FROM products WHERE id = ?', [id]);
  persistDatabase();
}

export function createProductIngredient(
  productId: number,
  input: ProductIngredientInput,
): number {
  const sort =
    input.sort_order ??
    rowsFrom<{ c: number }>(
      'SELECT COUNT(*) AS c FROM product_ingredients WHERE product_id = ?',
      [productId],
    )[0]?.c ??
    0;

  getDatabase().run(
    `INSERT INTO product_ingredients
      (product_id, cod_aje, cod_emb, description, um, factor, category, is_active, substitute_of_id, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      productId,
      input.cod_aje,
      input.cod_emb,
      input.description,
      input.um,
      input.factor,
      input.category ?? null,
      input.is_active === false ? 0 : 1,
      input.substitute_of_id ?? null,
      sort,
    ],
  );
  const id = lastId();
  persistDatabase();
  return id;
}

export function updateProductIngredient(
  id: number,
  input: ProductIngredientInput,
): void {
  getDatabase().run(
    `UPDATE product_ingredients SET
      cod_aje = ?, cod_emb = ?, description = ?, um = ?, factor = ?,
      category = ?, is_active = ?, substitute_of_id = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      input.cod_aje,
      input.cod_emb,
      input.description,
      input.um,
      input.factor,
      input.category ?? null,
      input.is_active === false ? 0 : 1,
      input.substitute_of_id ?? null,
      id,
    ],
  );
  persistDatabase();
}

export function deleteProductIngredient(id: number): void {
  const db = getDatabase();
  db.run(
    'UPDATE product_ingredients SET substitute_of_id = NULL WHERE substitute_of_id = ?',
    [id],
  );
  db.run('DELETE FROM product_ingredients WHERE id = ?', [id]);
  persistDatabase();
}
