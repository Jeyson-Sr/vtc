import { useState } from 'react';
import * as repo from '@/db/repositories';
import { useData } from '@/hooks/useVtcData';
import type { Syrup, SyrupIngredient } from '@/types/vtc';

const emptySyrup = {
  sku: '',
  name: '',
  notes: '',
};

const emptyIngredient = {
  cod_aje: '',
  cod_emb: 'E-01',
  description: '',
  um: 'KG',
  factor: '',
  is_active: true,
  substitute_of_id: '',
};

export function JarabesPage() {
  const { syrups, refresh } = useData();
  const [syrupDialog, setSyrupDialog] = useState(false);
  const [ingredientDialog, setIngredientDialog] = useState(false);
  const [editingSyrup, setEditingSyrup] = useState<Syrup | null>(null);
  const [selectedSyrup, setSelectedSyrup] = useState<Syrup | null>(null);
  const [editingIngredient, setEditingIngredient] =
    useState<SyrupIngredient | null>(null);
  const [syrupForm, setSyrupForm] = useState(emptySyrup);
  const [ingredientForm, setIngredientForm] = useState(emptyIngredient);

  const openCreateSyrup = () => {
    setEditingSyrup(null);
    setSyrupForm(emptySyrup);
    setSyrupDialog(true);
  };

  const openEditSyrup = (syrup: Syrup) => {
    setEditingSyrup(syrup);
    setSyrupForm({
      sku: syrup.sku ?? '',
      name: syrup.name,
      notes: syrup.notes ?? '',
    });
    setSyrupDialog(true);
  };

  const saveSyrup = () => {
    const payload = {
      sku: syrupForm.sku || null,
      name: syrupForm.name,
      notes: syrupForm.notes || null,
    };

    if (editingSyrup) {
      repo.updateSyrup(editingSyrup.id, payload);
    } else {
      repo.createSyrup(payload);
    }
    setSyrupDialog(false);
    refresh();
  };

  const deleteSyrup = (syrup: Syrup) => {
    if (!confirm(`¿Eliminar jarabe "${syrup.name}"?`)) return;
    repo.deleteSyrup(syrup.id);
    refresh();
  };

  const openIngredients = (syrup: Syrup) => {
    setSelectedSyrup(syrup);
    setEditingIngredient(null);
    setIngredientForm(emptyIngredient);
    setIngredientDialog(true);
  };

  const openEditIngredient = (syrup: Syrup, ingredient: SyrupIngredient) => {
    setSelectedSyrup(syrup);
    setEditingIngredient(ingredient);
    setIngredientForm({
      cod_aje: ingredient.cod_aje,
      cod_emb: ingredient.cod_emb,
      description: ingredient.description,
      um: ingredient.um,
      factor: String(ingredient.factor),
      is_active: ingredient.is_active,
      substitute_of_id: ingredient.substitute_of_id?.toString() ?? '',
    });
    setIngredientDialog(true);
  };

  const saveIngredient = () => {
    if (!selectedSyrup) return;

    const payload = {
      cod_aje: ingredientForm.cod_aje,
      cod_emb: ingredientForm.cod_emb,
      description: ingredientForm.description,
      um: ingredientForm.um,
      factor: Number(ingredientForm.factor) || 0,
      is_active: ingredientForm.is_active,
      substitute_of_id: ingredientForm.substitute_of_id
        ? Number(ingredientForm.substitute_of_id)
        : null,
    };

    if (editingIngredient) {
      repo.updateSyrupIngredient(editingIngredient.id, payload);
    } else {
      repo.createSyrupIngredient(selectedSyrup.id, payload);
    }
    setIngredientDialog(false);
    refresh();
  };

  const deleteIngredient = (ingredient: SyrupIngredient) => {
    if (!confirm('¿Eliminar este insumo?')) return;
    repo.deleteSyrupIngredient(ingredient.id);
    refresh();
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Jarabes</h1>
          <p>Administre fórmulas de jarabe e ingredientes por lote.</p>
        </div>
        <button type="button" className="btn" onClick={openCreateSyrup}>
          Nuevo jarabe
        </button>
      </div>

      <div className="card-list">
        {syrups.map((syrup) => (
          <article className="entity-card" key={syrup.id}>
            <div className="entity-head">
              <div>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  {syrup.sku ?? '—'}
                </span>
                <h2>{syrup.name}</h2>
                {syrup.notes ? <p className="meta">{syrup.notes}</p> : null}
              </div>
              <div className="row">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => openIngredients(syrup)}
                >
                  Insumos
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => openEditSyrup(syrup)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => deleteSyrup(syrup)}
                >
                  Eliminar
                </button>
              </div>
            </div>

            {syrup.ingredients.length > 0 && (
              <div className="entity-body table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Cod. AJE</th>
                      <th>Cod. EMB</th>
                      <th>Descripción</th>
                      <th>U.M.</th>
                      <th>Factor/lote</th>
                      <th>Acc.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {syrup.ingredients.map((ing) => (
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
                        <td className="inline-actions">
                          <button
                            type="button"
                            onClick={() => openEditIngredient(syrup, ing)}
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

      {syrupDialog && (
        <div className="modal-backdrop" onClick={() => setSyrupDialog(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <header>
              <h3>{editingSyrup ? 'Editar jarabe' : 'Nuevo jarabe'}</h3>
            </header>
            <div className="modal-body field-grid">
              <div className="field">
                <label>SKU</label>
                <input
                  value={syrupForm.sku}
                  onChange={(e) =>
                    setSyrupForm((f) => ({ ...f, sku: e.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label>Nombre</label>
                <input
                  value={syrupForm.name}
                  onChange={(e) =>
                    setSyrupForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label>Notas</label>
                <textarea
                  rows={3}
                  value={syrupForm.notes}
                  onChange={(e) =>
                    setSyrupForm((f) => ({ ...f, notes: e.target.value }))
                  }
                />
              </div>
            </div>
            <footer>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSyrupDialog(false)}
              >
                Cancelar
              </button>
              <button type="button" className="btn" onClick={saveSyrup}>
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
                  : `Insumo — ${selectedSyrup?.name ?? ''}`}
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
              <div className="field-grid cols-2">
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
                  <label>Factor/lote</label>
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
              </div>
              {selectedSyrup && selectedSyrup.ingredients.length > 0 && (
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
                    {selectedSyrup.ingredients
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
