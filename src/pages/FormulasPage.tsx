import { useState } from 'react';
import * as repo from '@/db/repositories';
import { useData } from '@/hooks/useVtcData';
import type { Product, ProductIngredient } from '@/types/vtc';
import { PRODUCT_CATEGORIES } from '@/types/vtc';

type ProductForm = {
  sku: string;
  name: string;
  type: 'envasado' | 'auxiliar';
  syrup_id: string;
  units_per_package: string;
  syrup_factor: string;
  water_factor: string;
  yield_factor: string;
  notes: string;
};

const emptyProduct: ProductForm = {
  sku: '',
  name: '',
  type: 'envasado',
  syrup_id: '',
  units_per_package: '12',
  syrup_factor: '0',
  water_factor: '0',
  yield_factor: '0.997',
  notes: '',
};

const emptyIngredient = {
  cod_aje: '',
  cod_emb: '',
  description: '',
  um: 'UND',
  factor: '',
  category: '',
  is_active: true,
  substitute_of_id: '',
};

export function FormulasPage() {
  const { products, syrupSummaries, refresh } = useData();
  const [productDialog, setProductDialog] = useState(false);
  const [ingredientDialog, setIngredientDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingIngredient, setEditingIngredient] =
    useState<ProductIngredient | null>(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [ingredientForm, setIngredientForm] = useState(emptyIngredient);

  const openCreateProduct = () => {
    setEditingProduct(null);
    setProductForm(emptyProduct);
    setProductDialog(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      sku: product.sku,
      name: product.name,
      type: product.type,
      syrup_id: product.syrup_id?.toString() ?? '',
      units_per_package: String(product.units_per_package),
      syrup_factor: String(product.syrup_factor),
      water_factor: String(product.water_factor),
      yield_factor: String(product.yield_factor),
      notes: product.notes ?? '',
    });
    setProductDialog(true);
  };

  const saveProduct = () => {
    const payload = {
      sku: productForm.sku,
      name: productForm.name,
      type: productForm.type,
      syrup_id: productForm.syrup_id
        ? Number(productForm.syrup_id)
        : null,
      units_per_package: Number(productForm.units_per_package) || 0,
      syrup_factor: Number(productForm.syrup_factor) || 0,
      water_factor: Number(productForm.water_factor) || 0,
      yield_factor: Number(productForm.yield_factor) || 0,
      notes: productForm.notes || null,
    };

    if (editingProduct) {
      repo.updateProduct(editingProduct.id, payload);
    } else {
      repo.createProduct(payload);
    }
    setProductDialog(false);
    refresh();
  };

  const deleteProduct = (product: Product) => {
    if (!confirm(`¿Eliminar fórmula "${product.name}"?`)) return;
    repo.deleteProduct(product.id);
    refresh();
  };

  const openIngredients = (product: Product) => {
    setSelectedProduct(product);
    setEditingIngredient(null);
    setIngredientForm(emptyIngredient);
    setIngredientDialog(true);
  };

  const openEditIngredient = (product: Product, ingredient: ProductIngredient) => {
    setSelectedProduct(product);
    setEditingIngredient(ingredient);
    setIngredientForm({
      cod_aje: ingredient.cod_aje,
      cod_emb: ingredient.cod_emb,
      description: ingredient.description,
      um: ingredient.um,
      factor: String(ingredient.factor),
      category: ingredient.category ?? '',
      is_active: ingredient.is_active,
      substitute_of_id: ingredient.substitute_of_id?.toString() ?? '',
    });
    setIngredientDialog(true);
  };

  const saveIngredient = () => {
    if (!selectedProduct) return;

    const payload = {
      cod_aje: ingredientForm.cod_aje,
      cod_emb: ingredientForm.cod_emb,
      description: ingredientForm.description,
      um: ingredientForm.um,
      factor: Number(ingredientForm.factor) || 0,
      category: ingredientForm.category || null,
      is_active: ingredientForm.is_active,
      substitute_of_id: ingredientForm.substitute_of_id
        ? Number(ingredientForm.substitute_of_id)
        : null,
    };

    if (editingIngredient) {
      repo.updateProductIngredient(editingIngredient.id, payload);
    } else {
      repo.createProductIngredient(selectedProduct.id, payload);
    }
    setIngredientDialog(false);
    refresh();
  };

  const deleteIngredient = (ingredient: ProductIngredient) => {
    if (!confirm('¿Eliminar este insumo?')) return;
    repo.deleteProductIngredient(ingredient.id);
    refresh();
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Fórmulas de envasado</h1>
          <p>
            Administre productos, factores por paquete e insumos de empaque.
          </p>
        </div>
        <button type="button" className="btn" onClick={openCreateProduct}>
          Nueva fórmula
        </button>
      </div>

      <div className="card-list">
        {products.map((product) => (
          <article className="entity-card" key={product.id}>
            <div className="entity-head">
              <div>
                <span className="badge">{product.type}</span>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  {product.sku}
                </span>
                <h2>{product.name}</h2>
                <p className="meta">
                  Jarabe: {product.syrup?.name ?? '—'} · Factor jarabe:{' '}
                  {product.syrup_factor} L/paq · Agua: {product.water_factor} ·
                  Rendimiento: {product.yield_factor}
                </p>
              </div>
              <div className="row">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => openIngredients(product)}
                >
                  Insumos
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => openEditProduct(product)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => deleteProduct(product)}
                >
                  Eliminar
                </button>
              </div>
            </div>

            {product.ingredients && product.ingredients.length > 0 && (
              <div className="entity-body table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Cod. AJE</th>
                      <th>Cod. EMB</th>
                      <th>Descripción</th>
                      <th>U.M.</th>
                      <th>Factor/paq</th>
                      <th>Cat.</th>
                      <th>Acc.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.ingredients.map((ing) => (
                      <tr key={ing.id}>
                        <td className="mono">{ing.cod_aje}</td>
                        <td className="mono">{ing.cod_emb}</td>
                        <td>
                          {ing.description}
                          {ing.substitute_of_id ? (
                            <span style={{ color: 'var(--brand)' }}> (sust.)</span>
                          ) : null}
                        </td>
                        <td>{ing.um}</td>
                        <td>{ing.factor}</td>
                        <td>{ing.category ?? '—'}</td>
                        <td className="inline-actions">
                          <button
                            type="button"
                            onClick={() => openEditIngredient(product, ing)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="danger"
                            onClick={() => deleteIngredient(ing)}
                          >
                            Borrar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        ))}
      </div>

      {productDialog && (
        <div className="modal-backdrop" onClick={() => setProductDialog(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <header>
              <h3>{editingProduct ? 'Editar fórmula' : 'Nueva fórmula'}</h3>
            </header>
            <div className="modal-body field-grid">
              <div className="field-grid cols-2">
                <div className="field">
                  <label>SKU</label>
                  <input
                    value={productForm.sku}
                    onChange={(e) =>
                      setProductForm((f) => ({ ...f, sku: e.target.value }))
                    }
                  />
                </div>
                <div className="field">
                  <label>Tipo</label>
                  <select
                    value={productForm.type}
                    onChange={(e) =>
                      setProductForm((f) => ({
                        ...f,
                        type: e.target.value as 'envasado' | 'auxiliar',
                      }))
                    }
                  >
                    <option value="envasado">Envasado</option>
                    <option value="auxiliar">Auxiliar</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Nombre</label>
                <input
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label>Jarabe vinculado</label>
                <select
                  value={productForm.syrup_id}
                  onChange={(e) =>
                    setProductForm((f) => ({ ...f, syrup_id: e.target.value }))
                  }
                >
                  <option value="">Sin jarabe</option>
                  {syrupSummaries.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field-grid cols-2">
                <div className="field">
                  <label>Unidades/paquete</label>
                  <input
                    type="number"
                    step="any"
                    value={productForm.units_per_package}
                    onChange={(e) =>
                      setProductForm((f) => ({
                        ...f,
                        units_per_package: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="field">
                  <label>Factor jarabe (L/paq)</label>
                  <input
                    type="number"
                    step="any"
                    value={productForm.syrup_factor}
                    onChange={(e) =>
                      setProductForm((f) => ({
                        ...f,
                        syrup_factor: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="field">
                  <label>Factor agua (L/paq)</label>
                  <input
                    type="number"
                    step="any"
                    value={productForm.water_factor}
                    onChange={(e) =>
                      setProductForm((f) => ({
                        ...f,
                        water_factor: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="field">
                  <label>Rendimiento (yield)</label>
                  <input
                    type="number"
                    step="any"
                    value={productForm.yield_factor}
                    onChange={(e) =>
                      setProductForm((f) => ({
                        ...f,
                        yield_factor: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <footer>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setProductDialog(false)}
              >
                Cancelar
              </button>
              <button type="button" className="btn" onClick={saveProduct}>
                Guardar
              </button>
            </footer>
          </div>
        </div>
      )}

      {ingredientDialog && (
        <div
          className="modal-backdrop"
          onClick={() => setIngredientDialog(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <header>
              <h3>
                {editingIngredient
                  ? 'Editar insumo'
                  : `Insumo — ${selectedProduct?.name ?? ''}`}
              </h3>
            </header>
            <div className="modal-body field-grid">
              <div className="field-grid cols-2">
                <div className="field">
                  <label>Cod. AJE</label>
                  <input
                    value={ingredientForm.cod_aje}
                    onChange={(e) =>
                      setIngredientForm((f) => ({
                        ...f,
                        cod_aje: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="field">
                  <label>Cod. EMB</label>
                  <input
                    value={ingredientForm.cod_emb}
                    onChange={(e) =>
                      setIngredientForm((f) => ({
                        ...f,
                        cod_emb: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="field">
                <label>Descripción</label>
                <input
                  value={ingredientForm.description}
                  onChange={(e) =>
                    setIngredientForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="field-grid cols-3">
                <div className="field">
                  <label>U.M.</label>
                  <input
                    value={ingredientForm.um}
                    onChange={(e) =>
                      setIngredientForm((f) => ({ ...f, um: e.target.value }))
                    }
                  />
                </div>
                <div className="field">
                  <label>Factor/paquete</label>
                  <input
                    type="number"
                    step="any"
                    value={ingredientForm.factor}
                    onChange={(e) =>
                      setIngredientForm((f) => ({
                        ...f,
                        factor: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="field">
                  <label>Categoría</label>
                  <select
                    value={ingredientForm.category}
                    onChange={(e) =>
                      setIngredientForm((f) => ({
                        ...f,
                        category: e.target.value,
                      }))
                    }
                  >
                    <option value="">—</option>
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {selectedProduct?.ingredients &&
                selectedProduct.ingredients.length > 0 && (
                  <div className="field">
                    <label>Sustituto de</label>
                    <select
                      value={ingredientForm.substitute_of_id}
                      onChange={(e) =>
                        setIngredientForm((f) => ({
                          ...f,
                          substitute_of_id: e.target.value,
                        }))
                      }
                    >
                      <option value="">Ninguno</option>
                      {selectedProduct.ingredients
                        .filter((i) => i.id !== editingIngredient?.id)
                        .map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.description}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
            </div>
            <footer>
              {!editingIngredient && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setEditingIngredient(null);
                    setIngredientForm(emptyIngredient);
                  }}
                >
                  Limpiar
                </button>
              )}
              <button type="button" className="btn" onClick={saveIngredient}>
                Guardar insumo
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
