import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import VtcLayout from '@/layouts/vtc-layout';
import http from '@/lib/http';
import type { Product, SyrupSummary, VtcLine, VtcResult } from '@/types/vtc';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Generar VTC', href: '/vtc' },
];

type ProductLine = {
    product_id: string;
    packages: string;
};

type SyrupBatch = {
    syrup_id: number;
    batches: string;
};

type Props = {
    products: Product[];
    syrups: SyrupSummary[];
};

function formatQty(value: number): string {
    return Math.round(value)
        .toLocaleString('es-ES', { useGrouping: true })
        .replace(/\./g, ',');
}

export default function VtcIndex({ products, syrups }: Props) {
    const [lines, setLines] = useState<ProductLine[]>([
        { product_id: '', packages: '' },
    ]);
    const [syrupBatches, setSyrupBatches] = useState<SyrupBatch[]>(
        syrups.map((s) => ({ syrup_id: s.id, batches: '' })),
    );
    const [result, setResult] = useState<VtcResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const buildPayload = () => ({
        product_lines: lines
            .filter((l) => l.product_id && parseFloat(l.packages) > 0)
            .map((l) => ({
                product_id: parseInt(l.product_id, 10),
                packages: parseFloat(l.packages),
            })),
        syrup_batches: syrupBatches
            .filter((s) => parseFloat(s.batches) > 0)
            .map((s) => ({
                syrup_id: s.syrup_id,
                batches: parseFloat(s.batches),
            })),
    });

    const calculate = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { data } = await http.post<VtcResult>(
                '/vtc/calcular',
                buildPayload(),
            );
            setResult(data);
        } catch {
            setError('No se pudo calcular la VTC. Verifique los datos ingresados.');
        } finally {
            setLoading(false);
        }
    };

    const sendEmail = async () => {
        setSending(true);
        setError(null);
        setMessage(null);

        try {
            const { data } = await http.post<{ message: string }>(
                '/vtc/enviar',
                buildPayload(),
            );
            setMessage(data.message);
        } catch {
            setError('Error al enviar el correo. Intente nuevamente.');
        } finally {
            setSending(false);
        }
    };

    const updateLine = (index: number, field: keyof ProductLine, value: string) => {
        setLines((prev) =>
            prev.map((line, i) =>
                i === index ? { ...line, [field]: value } : line,
            ),
        );
    };

    const aggregated: VtcLine[] = result?.aggregated ?? [];

    return (
        <VtcLayout breadcrumbs={breadcrumbs}>
            <Head title="Generar VTC" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-xl font-semibold text-[#1a6b3c]">
                        Generar VTC
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Ingrese productos en paquetes (cajas) y lotes de jarabe
                        para la explosión de materiales.
                    </p>
                </div>

                <section className="rounded-xl border bg-card p-4 shadow-sm">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#1a6b3c]">
                        Productos (paquetes)
                    </h2>

                    <div className="space-y-2">
                        {lines.map((line, index) => (
                            <div
                                key={index}
                                className="flex flex-wrap items-center gap-2"
                            >
                                <select
                                    value={line.product_id}
                                    onChange={(e) =>
                                        updateLine(
                                            index,
                                            'product_id',
                                            e.target.value,
                                        )
                                    }
                                    className="min-w-[220px] flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                                >
                                    <option value="">Seleccionar producto...</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            [{p.type}] {p.name}
                                        </option>
                                    ))}
                                </select>
                                <Input
                                    type="number"
                                    min="0"
                                    step="any"
                                    placeholder="Paquetes"
                                    value={line.packages}
                                    onChange={(e) =>
                                        updateLine(
                                            index,
                                            'packages',
                                            e.target.value,
                                        )
                                    }
                                    className="w-32"
                                />
                                {lines.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            setLines((prev) =>
                                                prev.filter((_, i) => i !== index),
                                            )
                                        }
                                    >
                                        Quitar
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() =>
                            setLines((prev) => [
                                ...prev,
                                { product_id: '', packages: '' },
                            ])
                        }
                    >
                        + Agregar línea
                    </Button>
                </section>

                <section className="rounded-xl border bg-card p-4 shadow-sm">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#1a6b3c]">
                        Jarabes (lotes)
                    </h2>
                    <p className="mb-3 text-xs text-muted-foreground">
                        Los litros de jarabe se calculan desde las fórmulas de
                        envasado. Ingrese lotes para la explosión de ingredientes
                        del jarabe.
                    </p>

                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {syrupBatches.map((row, index) => {
                            const syrup = syrups.find((s) => s.id === row.syrup_id);

                            return (
                                <div
                                    key={row.syrup_id}
                                    className="flex items-center gap-2 rounded-lg border p-2"
                                >
                                    <span className="flex-1 truncate text-sm">
                                        {syrup?.name}
                                    </span>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="any"
                                        placeholder="Lotes"
                                        value={row.batches}
                                        onChange={(e) =>
                                            setSyrupBatches((prev) =>
                                                prev.map((s, i) =>
                                                    i === index
                                                        ? {
                                                              ...s,
                                                              batches:
                                                                  e.target.value,
                                                          }
                                                        : s,
                                                ),
                                            )
                                        }
                                        className="w-24"
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {result?.syrup_liters &&
                        Object.keys(result.syrup_liters).length > 0 && (
                            <div className="mt-3 rounded-md bg-[#1a6b3c]/5 p-3 text-xs text-[#1a6b3c]">
                                Litros de jarabe calculados:{' '}
                                {Object.entries(result.syrup_liters).map(
                                    ([id, liters]) => {
                                        const syrup = syrups.find(
                                            (s) => s.id === parseInt(id, 10),
                                        );

                                        return (
                                            <span key={id} className="mr-3">
                                                {syrup?.name}:{' '}
                                                {liters.toFixed(2)} L
                                            </span>
                                        );
                                    },
                                )}
                            </div>
                        )}
                </section>

                <div className="flex flex-wrap gap-3">
                    <Button
                        type="button"
                        className="bg-[#1a6b3c] hover:bg-[#155a32]"
                        onClick={calculate}
                        disabled={loading}
                    >
                        {loading ? 'Calculando...' : 'Calcular VTC'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={sendEmail}
                        disabled={sending || !result}
                    >
                        {sending ? 'Enviando...' : 'Enviar VTC por correo'}
                    </Button>
                </div>

                {message && (
                    <p className="text-sm text-[#1a6b3c]">{message}</p>
                )}
                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}

                {aggregated.length > 0 && (
                    <section className="rounded-xl border bg-card shadow-sm overflow-hidden">
                        <div className="border-b bg-[#1a6b3c] px-4 py-3">
                            <h2 className="text-sm font-semibold text-white uppercase tracking-wide">
                                Resumen VTC
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right text-xs">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        {[
                                            'Cod. AJE',
                                            'Cod. EMB',
                                            'Descripción',
                                            'U.M.',
                                            'Cantidad',
                                        ].map((h) => (
                                            <th
                                                key={h}
                                                className="px-3 py-2.5 text-left font-semibold uppercase tracking-wider"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {aggregated.map((item, idx) => (
                                        <tr
                                            key={`${item.cod_aje}-${item.cod_emb}-${idx}`}
                                            className={
                                                idx % 2 === 0
                                                    ? 'bg-background'
                                                    : 'bg-muted/20'
                                            }
                                        >
                                            <td className="px-3 py-2 font-mono text-left">
                                                {item.cod_aje}
                                            </td>
                                            <td className="px-3 py-2 font-mono text-left">
                                                {item.cod_emb}
                                            </td>
                                            <td className="px-3 py-2 text-left">
                                                {item.description}
                                            </td>
                                            <td className="px-3 py-2 text-left uppercase">
                                                {item.um}
                                            </td>
                                            <td className="px-3 py-2 font-semibold">
                                                {formatQty(item.quantity)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </div>
        </VtcLayout>
    );
}
