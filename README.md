# VTC Caral — Sistema de explosión de materiales

Aplicación Laravel + Inertia React para **Embotelladora Caral**. Calcula la VTC (Valorización de Transferencia de Costos) a partir de fórmulas de envasado y jarabe almacenadas en SQLite.

## Requisitos

- PHP 8.2+
- Composer
- Node.js 20+
- SQLite (incluido por defecto)

## Instalación

```bash
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
npm install
npm run dev
```

En otra terminal:

```bash
php artisan serve
```

Abra `http://localhost:8000` — redirige a **Generar VTC**.

## Secciones del menú

| Sección | Descripción |
|---------|-------------|
| **Generar VTC** | Seleccione productos, ingrese **paquetes** (cajas) y **lotes** de jarabe; calcule y envíe la VTC por correo. |
| **Fórmulas** | CRUD de productos de envasado y auxiliares: insumos por paquete, factores de jarabe/agua, rendimiento. |
| **Jarabes** | CRUD de fórmulas de jarabe: ingredientes por **lote** de producción. |

## Reglas de cálculo

- **Envasado** se maneja en **paquetes** (cajas): cantidad = paquetes × factor del insumo.
- **Jarabe** se maneja en **lotes**: cantidad = lotes × factor del ingrediente.
- Los materiales de empaque (preforma, tapa, etiqueta, etc.) aplican **rendimiento** (`yield_factor`, default 0.997): cantidad bruta = (paquetes × factor) ÷ rendimiento.
- Litros de jarabe = paquetes × `syrup_factor` de cada producto de envasado.
- Agua = paquetes × `water_factor`.
- Los resultados se agrupan por código AJE para el resumen y el correo.

## Datos iniciales

`php artisan migrate --seed` carga las fórmulas de jarabe, envasado y auxiliares migradas desde el sistema anterior.

## Repositorio

[github.com/Jeyson-Sr/vtc](https://github.com/Jeyson-Sr/vtc)
