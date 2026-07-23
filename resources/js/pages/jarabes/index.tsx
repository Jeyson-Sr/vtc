import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import VtcLayout from '@/layouts/vtc-layout';
import type { Syrup, SyrupIngredient } from '@/types/vtc';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Jarabes', href: '/jarabes' },
];

type Props = {
    syrups: Syrup[];
};

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

export default function JarabesIndex({ syrups }: Props) {
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
        if (editingSyrup) {
            router.put(`/jarabes/${editingSyrup.id}`, syrupForm, {
                preserveScroll: true,
                onSuccess: () => setSyrupDialog(false),
            });
        } else {
            router.post('/jarabes', syrupForm, {
                preserveScroll: true,
                onSuccess: () => setSyrupDialog(false),
            });
        }
    };

    const deleteSyrup = (syrup: Syrup) => {
        if (!confirm(`¿Eliminar jarabe "${syrup.name}"?`)) {
            return;
        }

        router.delete(`/jarabes/${syrup.id}`, { preserveScroll: true });
    };

    const openIngredients = (syrup: Syrup) => {
        setSelectedSyrup(syrup);
        setEditingIngredient(null);
        setIngredientForm(emptyIngredient);
        setIngredientDialog(true);
    };

    const openEditIngredient = (ingredient: SyrupIngredient) => {
        setEditingIngredient(ingredient);
        setIngredientForm({
            cod_aje: ingredient.cod_aje,
            cod_emb: ingredient.cod_emb,
            description: ingredient.description,
            um: ingredient.um,
            factor: String(ingredient.factor),
            is_active: ingredient.is_active,
            substitute_of_id:
                ingredient.substitute_of_id?.toString() ?? '',
        });
        setIngredientDialog(true);
    };

    const saveIngredient = () => {
        if (!selectedSyrup) {
            return;
        }

        const payload = {
            ...ingredientForm,
            factor: parseFloat(ingredientForm.factor),
            substitute_of_id: ingredientForm.substitute_of_id
                ? parseInt(ingredientForm.substitute_of_id, 10)
                : null,
        };

        if (editingIngredient) {
            router.put(
                `/jarabes/${selectedSyrup.id}/ingredients/${editingIngredient.id}`,
                payload,
                {
                    preserveScroll: true,
                    onSuccess: () => setIngredientDialog(false),
                },
            );
        } else {
            router.post(
                `/jarabes/${selectedSyrup.id}/ingredients`,
                payload,
                {
                    preserveScroll: true,
                    onSuccess: () => setIngredientDialog(false),
                },
            );
        }
    };

    const deleteIngredient = (syrup: Syrup, ingredient: SyrupIngredient) => {
        if (!confirm('¿Eliminar este ingrediente?')) {
            return;
        }

        router.delete(
            `/jarabes/${syrup.id}/ingredients/${ingredient.id}`,
            { preserveScroll: true },
        );
    };

    return (
        <VtcLayout breadcrumbs={breadcrumbs}>
            <Head title="Jarabes" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-[#1a6b3c]">
                            Fórmulas de jarabe
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Ingredientes por lote de producción de jarabe.
                        </p>
                    </div>
                    <Button
                        className="bg-[#1a6b3c] hover:bg-[#155a32]"
                        onClick={openCreateSyrup}
                    >
                        Nuevo jarabe
                    </Button>
                </div>

                <div className="space-y-4">
                    {syrups.map((syrup) => (
                        <div
                            key={syrup.id}
                            className="rounded-xl border bg-card shadow-sm"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3 border-b p-4">
                                <div>
                                    {syrup.sku && (
                                        <span className="font-mono text-xs text-muted-foreground">
                                            {syrup.sku}
                                        </span>
                                    )}
                                    <h2 className="font-semibold">{syrup.name}</h2>
                                    {syrup.notes && (
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {syrup.notes}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openIngredients(syrup)}
                                    >
                                        Ingredientes
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openEditSyrup(syrup)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteSyrup(syrup)}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </div>

                            {syrup.ingredients.length > 0 && (
                                <div className="overflow-x-auto p-4 pt-0">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b text-left text-muted-foreground">
                                                <th className="py-2 pr-2">Cod. AJE</th>
                                                <th className="py-2 pr-2">Cod. EMB</th>
                                                <th className="py-2 pr-2">Descripción</th>
                                                <th className="py-2 pr-2">U.M.</th>
                                                <th className="py-2 pr-2">Factor/lote</th>
                                                <th className="py-2">Acc.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {syrup.ingredients.map((ing) => (
                                                <tr
                                                    key={ing.id}
                                                    className="border-b border-muted/40"
                                                >
                                                    <td className="py-2 pr-2 font-mono">
                                                        {ing.cod_aje}
                                                    </td>
                                                    <td className="py-2 pr-2 font-mono">
                                                        {ing.cod_emb}
                                                    </td>
                                                    <td className="py-2 pr-2">
                                                        {ing.description}
                                                        {ing.substitute_of_id && (
                                                            <span className="ml-1 text-[#1a6b3c]">
                                                                (sust.)
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-2 pr-2">
                                                        {ing.um}
                                                    </td>
                                                    <td className="py-2 pr-2">
                                                        {ing.factor}
                                                    </td>
                                                    <td className="py-2">
                                                        <button
                                                            type="button"
                                                            className="mr-2 text-[#1a6b3c] hover:underline"
                                                            onClick={() => {
                                                                setSelectedSyrup(
                                                                    syrup,
                                                                );
                                                                openEditIngredient(
                                                                    ing,
                                                                );
                                                                setIngredientDialog(
                                                                    true,
                                                                );
                                                            }}
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="text-destructive hover:underline"
                                                            onClick={() =>
                                                                deleteIngredient(
                                                                    syrup,
                                                                    ing,
                                                                )
                                                            }
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
                        </div>
                    ))}
                </div>
            </div>

            <Dialog open={syrupDialog} onOpenChange={setSyrupDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingSyrup ? 'Editar jarabe' : 'Nuevo jarabe'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-3">
                        <div>
                            <Label>SKU</Label>
                            <Input
                                value={syrupForm.sku}
                                onChange={(e) =>
                                    setSyrupForm((f) => ({
                                        ...f,
                                        sku: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <Label>Nombre</Label>
                            <Input
                                value={syrupForm.name}
                                onChange={(e) =>
                                    setSyrupForm((f) => ({
                                        ...f,
                                        name: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <Label>Notas</Label>
                            <Input
                                value={syrupForm.notes}
                                onChange={(e) =>
                                    setSyrupForm((f) => ({
                                        ...f,
                                        notes: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            className="bg-[#1a6b3c] hover:bg-[#155a32]"
                            onClick={saveSyrup}
                        >
                            Guardar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={ingredientDialog} onOpenChange={setIngredientDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingIngredient
                                ? 'Editar ingrediente'
                                : `Ingrediente — ${selectedSyrup?.name ?? ''}`}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Cod. AJE</Label>
                                <Input
                                    value={ingredientForm.cod_aje}
                                    onChange={(e) =>
                                        setIngredientForm((f) => ({
                                            ...f,
                                            cod_aje: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div>
                                <Label>Cod. EMB</Label>
                                <Input
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
                        <div>
                            <Label>Descripción</Label>
                            <Input
                                value={ingredientForm.description}
                                onChange={(e) =>
                                    setIngredientForm((f) => ({
                                        ...f,
                                        description: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>U.M.</Label>
                                <Input
                                    value={ingredientForm.um}
                                    onChange={(e) =>
                                        setIngredientForm((f) => ({
                                            ...f,
                                            um: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div>
                                <Label>Factor por lote</Label>
                                <Input
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
                        {selectedSyrup?.ingredients &&
                            selectedSyrup.ingredients.length > 0 && (
                                <div>
                                    <Label>Sustituto de</Label>
                                    <select
                                        value={ingredientForm.substitute_of_id}
                                        onChange={(e) =>
                                            setIngredientForm((f) => ({
                                                ...f,
                                                substitute_of_id: e.target.value,
                                            }))
                                        }
                                        className="w-full rounded-md border px-3 py-2 text-sm"
                                    >
                                        <option value="">Ninguno</option>
                                        {selectedSyrup.ingredients
                                            .filter(
                                                (i) =>
                                                    i.id !==
                                                    editingIngredient?.id,
                                            )
                                            .map((i) => (
                                                <option key={i.id} value={i.id}>
                                                    {i.description}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            )}
                    </div>
                    <DialogFooter>
                        <Button
                            className="bg-[#1a6b3c] hover:bg-[#155a32]"
                            onClick={saveIngredient}
                        >
                            Guardar ingrediente
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </VtcLayout>
    );
}
