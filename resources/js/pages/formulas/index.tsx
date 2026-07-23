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
import type { Product, ProductIngredient, SyrupSummary } from '@/types/vtc';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Fórmulas', href: '/formulas' },
];

type Props = {
    products: Product[];
    syrups: SyrupSummary[];
    categories: string[];
};

const emptyProduct = {
    sku: '',
    name: '',
    type: 'envasado' as const,
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

export default function FormulasIndex({ products, syrups, categories }: Props) {
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
            ...productForm,
            syrup_id: productForm.syrup_id
                ? parseInt(productForm.syrup_id, 10)
                : null,
        };

        if (editingProduct) {
            router.put(`/formulas/${editingProduct.id}`, payload, {
                preserveScroll: true,
                onSuccess: () => setProductDialog(false),
            });
        } else {
            router.post('/formulas', payload, {
                preserveScroll: true,
                onSuccess: () => setProductDialog(false),
            });
        }
    };

    const deleteProduct = (product: Product) => {
        if (!confirm(`¿Eliminar fórmula "${product.name}"?`)) {
            return;
        }

        router.delete(`/formulas/${product.id}`, { preserveScroll: true });
    };

    const openIngredients = (product: Product) => {
        setSelectedProduct(product);
        setEditingIngredient(null);
        setIngredientForm(emptyIngredient);
        setIngredientDialog(true);
    };

    const openEditIngredient = (ingredient: ProductIngredient) => {
        setEditingIngredient(ingredient);
        setIngredientForm({
            cod_aje: ingredient.cod_aje,
            cod_emb: ingredient.cod_emb,
            description: ingredient.description,
            um: ingredient.um,
            factor: String(ingredient.factor),
            category: ingredient.category ?? '',
            is_active: ingredient.is_active,
            substitute_of_id:
                ingredient.substitute_of_id?.toString() ?? '',
        });
        setIngredientDialog(true);
    };

    const saveIngredient = () => {
        if (!selectedProduct) {
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
                `/formulas/${selectedProduct.id}/ingredients/${editingIngredient.id}`,
                payload,
                {
                    preserveScroll: true,
                    onSuccess: () => setIngredientDialog(false),
                },
            );
        } else {
            router.post(
                `/formulas/${selectedProduct.id}/ingredients`,
                payload,
                {
                    preserveScroll: true,
                    onSuccess: () => setIngredientDialog(false),
                },
            );
        }
    };

    const deleteIngredient = (product: Product, ingredient: ProductIngredient) => {
        if (!confirm('¿Eliminar este insumo?')) {
            return;
        }

        router.delete(
            `/formulas/${product.id}/ingredients/${ingredient.id}`,
            { preserveScroll: true },
        );
    };

    return (
        <VtcLayout breadcrumbs={breadcrumbs}>
            <Head title="Fórmulas" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-[#1a6b3c]">
                            Fórmulas de envasado
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Administre productos, factores por paquete e insumos
                            de empaque.
                        </p>
                    </div>
                    <Button
                        className="bg-[#1a6b3c] hover:bg-[#155a32]"
                        onClick={openCreateProduct}
                    >
                        Nueva fórmula
                    </Button>
                </div>

                <div className="space-y-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="rounded-xl border bg-card shadow-sm"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3 border-b p-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="rounded bg-[#1a6b3c]/10 px-2 py-0.5 text-xs font-medium uppercase text-[#1a6b3c]">
                                            {product.type}
                                        </span>
                                        <span className="font-mono text-xs text-muted-foreground">
                                            {product.sku}
                                        </span>
                                    </div>
                                    <h2 className="mt-1 font-semibold">
                                        {product.name}
                                    </h2>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Jarabe:{' '}
                                        {product.syrup?.name ?? '—'} · Factor
                                        jarabe: {product.syrup_factor} L/paq ·
                                        Agua: {product.water_factor} · Rendimiento:{' '}
                                        {product.yield_factor}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openIngredients(product)}
                                    >
                                        Insumos
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openEditProduct(product)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteProduct(product)}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </div>

                            {product.ingredients && product.ingredients.length > 0 && (
                                <div className="overflow-x-auto p-4 pt-0">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b text-left text-muted-foreground">
                                                <th className="py-2 pr-2">Cod. AJE</th>
                                                <th className="py-2 pr-2">Cod. EMB</th>
                                                <th className="py-2 pr-2">Descripción</th>
                                                <th className="py-2 pr-2">U.M.</th>
                                                <th className="py-2 pr-2">Factor/paq</th>
                                                <th className="py-2 pr-2">Cat.</th>
                                                <th className="py-2">Acc.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {product.ingredients.map((ing) => (
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
                                                    <td className="py-2 pr-2">
                                                        {ing.category ?? '—'}
                                                    </td>
                                                    <td className="py-2">
                                                        <button
                                                            type="button"
                                                            className="mr-2 text-[#1a6b3c] hover:underline"
                                                            onClick={() => {
                                                                setSelectedProduct(
                                                                    product,
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
                                                                    product,
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

            <Dialog open={productDialog} onOpenChange={setProductDialog}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProduct ? 'Editar fórmula' : 'Nueva fórmula'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>SKU</Label>
                                <Input
                                    value={productForm.sku}
                                    onChange={(e) =>
                                        setProductForm((f) => ({
                                            ...f,
                                            sku: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div>
                                <Label>Tipo</Label>
                                <select
                                    value={productForm.type}
                                    onChange={(e) =>
                                        setProductForm((f) => ({
                                            ...f,
                                            type: e.target
                                                .value as 'envasado' | 'auxiliar',
                                        }))
                                    }
                                    className="w-full rounded-md border px-3 py-2 text-sm"
                                >
                                    <option value="envasado">Envasado</option>
                                    <option value="auxiliar">Auxiliar</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <Label>Nombre</Label>
                            <Input
                                value={productForm.name}
                                onChange={(e) =>
                                    setProductForm((f) => ({
                                        ...f,
                                        name: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <Label>Jarabe vinculado</Label>
                            <select
                                value={productForm.syrup_id}
                                onChange={(e) =>
                                    setProductForm((f) => ({
                                        ...f,
                                        syrup_id: e.target.value,
                                    }))
                                }
                                className="w-full rounded-md border px-3 py-2 text-sm"
                            >
                                <option value="">Sin jarabe</option>
                                {syrups.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Unidades/paquete</Label>
                                <Input
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
                            <div>
                                <Label>Factor jarabe (L/paq)</Label>
                                <Input
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
                            <div>
                                <Label>Factor agua (L/paq)</Label>
                                <Input
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
                            <div>
                                <Label>Rendimiento (yield)</Label>
                                <Input
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
                    <DialogFooter>
                        <Button
                            className="bg-[#1a6b3c] hover:bg-[#155a32]"
                            onClick={saveProduct}
                        >
                            Guardar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={ingredientDialog} onOpenChange={setIngredientDialog}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingIngredient
                                ? 'Editar insumo'
                                : `Insumo — ${selectedProduct?.name ?? ''}`}
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
                        <div className="grid grid-cols-3 gap-3">
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
                                <Label>Factor/paquete</Label>
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
                            <div>
                                <Label>Categoría</Label>
                                <select
                                    value={ingredientForm.category}
                                    onChange={(e) =>
                                        setIngredientForm((f) => ({
                                            ...f,
                                            category: e.target.value,
                                        }))
                                    }
                                    className="w-full rounded-md border px-3 py-2 text-sm"
                                >
                                    <option value="">—</option>
                                    {categories.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {selectedProduct?.ingredients &&
                            selectedProduct.ingredients.length > 0 && (
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
                                        {selectedProduct.ingredients
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
                    <DialogFooter className="gap-2">
                        {!editingIngredient && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setEditingIngredient(null);
                                    setIngredientForm(emptyIngredient);
                                }}
                            >
                                Limpiar
                            </Button>
                        )}
                        <Button
                            className="bg-[#1a6b3c] hover:bg-[#155a32]"
                            onClick={saveIngredient}
                        >
                            Guardar insumo
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </VtcLayout>
    );
}
