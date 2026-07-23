import { useEffect, useMemo, useState } from 'react';
import { useData } from '@/hooks/useVtcData';
import { calculateVtc } from '@/lib/calculator';
import type { VtcResult } from '@/types/vtc';

type ProductLine = {
  product_id: string;
  packages: string;
};

type SyrupBatch = {
  syrup_id: number;
  batches: string;
};

function formatQty(value: number): string {
  const decimals = Math.abs(value) >= 1 || value === 0 ? 0 : 6;
  return value.toLocaleString('es-PE', {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

function toCsv(result: VtcResult): string {
  const header = 'Cod. AJE,Cod. EMB,Descripción,U.M.,Cantidad';
  const rows = result.aggregated.map(
    (row) =>
      `${row.cod_aje},${row.cod_emb},"${row.description.replaceAll('"', '""')}",${row.um},${row.quantity}`,
  );
  return [header, ...rows].join('\n');
}

export function VtcPage() {
  const { products, syrups, syrupSummaries } = useData();
  const [lines, setLines] = useState<ProductLine[]>([
    { product_id: '', packages: '' },
  ]);
  const [syrupBatches, setSyrupBatches] = useState<SyrupBatch[]>([]);
  const [result, setResult] = useState<VtcResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSyrupBatches((prev) => {
      const map = new Map(prev.map((b) => [b.syrup_id, b.batches]));
      return syrupSummaries.map((s) => ({
        syrup_id: s.id,
        batches: map.get(s.id) ?? '',
      }));
    });
  }, [syrupSummaries]);

  const aggregated = result?.aggregated ?? [];

  const syrupLitersText = useMemo(() => {
    if (!result) return [];
    return Object.entries(result.syrup_liters).map(([id, liters]) => {
      const syrup = syrupSummaries.find((s) => s.id === Number(id));
      return `${syrup?.name ?? id}: ${liters.toFixed(2)} L`;
    });
  }, [result, syrupSummaries]);

  const updateLine = (index: number, field: keyof ProductLine, value: string) => {
    setLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, [field]: value } : line)),
    );
  };

  const calculate = () => {
    setError(null);
    setMessage(null);

    const productLines = lines
      .filter((l) => l.product_id && Number(l.packages) > 0)
      .map((l) => ({
        product_id: Number(l.product_id),
        packages: Number(l.packages),
      }));

    const batches = syrupBatches
      .filter((s) => Number(s.batches) > 0)
      .map((s) => ({
        syrup_id: s.syrup_id,
        batches: Number(s.batches),
      }));

    if (productLines.length === 0 && batches.length === 0) {
      setError('Ingrese al menos un producto o lotes de jarabe.');
      setResult(null);
      return;
    }

    setResult(calculateVtc(products, syrups, productLines, batches));
  };

  const copyCsv = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(toCsv(result));
      setMessage('VTC copiada al portapapeles (CSV).');
      setError(null);
    } catch {
      setError('No se pudo copiar al portapapeles.');
    }
  };

  const mailtoExport = () => {
    if (!result) return;
    const body = encodeURIComponent(toCsv(result));
    const subject = encodeURIComponent('VTC Embotelladora Caral');
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Generar VTC</h1>
          <p>
            Ingrese productos en paquetes (cajas) y lotes de jarabe para la
            explosión de materiales.
          </p>
        </div>
      </div>

      <section className="panel">
        <h2>Productos (paquetes)</h2>
        <div className="stack">
          {lines.map((line, index) => (
            <div className="row" key={index}>
              <select
                className="select-grow"
                value={line.product_id}
                onChange={(e) => updateLine(index, 'product_id', e.target.value)}
              >
                <option value="">Seleccionar producto...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.type}] {p.name}
                  </option>
                ))}
              </select>
              <input
                className="input-sm"
                type="number"
                min="0"
                step="any"
                placeholder="Paquetes"
                value={line.packages}
                onChange={(e) => updateLine(index, 'packages', e.target.value)}
              />
              {lines.length > 1 && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() =>
                    setLines((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  Quitar
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() =>
              setLines((prev) => [...prev, { product_id: '', packages: '' }])
            }
          >
            + Agregar línea
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>Jarabes (lotes)</h2>
        <p className="hint">
          Los litros de jarabe se calculan desde las fórmulas de envasado.
          Ingrese lotes para la explosión de ingredientes del jarabe.
        </p>
        <div className="grid-batches">
          {syrupBatches.map((row, index) => {
            const syrup = syrupSummaries.find((s) => s.id === row.syrup_id);
            return (
              <div className="batch-item" key={row.syrup_id}>
                <span>{syrup?.name}</span>
                <input
                  className="input-sm"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Lotes"
                  value={row.batches}
                  onChange={(e) =>
                    setSyrupBatches((prev) =>
                      prev.map((s, i) =>
                        i === index ? { ...s, batches: e.target.value } : s,
                      ),
                    )
                  }
                />
              </div>
            );
          })}
        </div>
        {syrupLitersText.length > 0 && (
          <div className="info-box">
            Litros de jarabe calculados: {syrupLitersText.join(' · ')}
          </div>
        )}
      </section>

      <div className="actions">
        <button type="button" className="btn" onClick={calculate}>
          Calcular VTC
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={copyCsv}
          disabled={!result}
        >
          Copiar CSV
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={mailtoExport}
          disabled={!result}
        >
          Abrir correo
        </button>
      </div>

      {message && <p className="msg ok">{message}</p>}
      {error && <p className="msg err">{error}</p>}

      {aggregated.length > 0 && (
        <section className="panel result-panel">
          <div className="result-head">Resumen VTC</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cod. AJE</th>
                  <th>Cod. EMB</th>
                  <th>Descripción</th>
                  <th>U.M.</th>
                  <th style={{ textAlign: 'right' }}>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {aggregated.map((item, idx) => (
                  <tr key={`${item.cod_aje}-${item.cod_emb}-${idx}`}>
                    <td className="mono">{item.cod_aje}</td>
                    <td className="mono">{item.cod_emb}</td>
                    <td>{item.description}</td>
                    <td>{item.um}</td>
                    <td className="qty">{formatQty(item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
