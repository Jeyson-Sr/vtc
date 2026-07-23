# VTC Caral

Aplicación industrial de **Valorización Técnica de Consumo (VTC)** para Embotelladora Caral.

SPA pura con **Vite + React + TypeScript**. Las fórmulas, jarabes e ingredientes se guardan en **SQLite en el navegador** (`sql.js`) y se persisten en `localStorage`.

## Requisitos

- Node.js 20+ (LTS recomendado)
- npm

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abra la URL que muestre Vite (por defecto `http://localhost:5173`).

## Build de producción

```bash
npm run build
npm run preview
```

## Funciones

- **Generar VTC**: productos × paquetes, lotes de jarabe, explosión de materiales, copia CSV / correo
- **Fórmulas**: CRUD de productos e insumos (con sustitutos)
- **Jarabes**: CRUD de jarabes e ingredientes

Los datos Sporade se cargan automáticamente la primera vez que abre la app.
