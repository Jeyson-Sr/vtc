import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js';
import { seedDatabase } from '@/db/seed';

const STORAGE_KEY = 'vtc-caral-sqlite';
const META_KEY = 'vtc-caral-meta';

let SQL: SqlJsStatic | null = null;
let db: Database | null = null;
const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((fn) => fn());
}

export function subscribeDb(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToUint8(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function loadSqlJs(): Promise<SqlJsStatic> {
  if (SQL) return SQL;

  SQL = await initSqlJs({
    locateFile: (file) => {
      if (file.endsWith('.wasm')) {
        return `${import.meta.env.BASE_URL}assets/sql-wasm.wasm`;
      }
      return file;
    },
  });

  return SQL;
}

function createSchema(database: Database): void {
  database.run(`
    CREATE TABLE IF NOT EXISTS syrups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT,
      name TEXT NOT NULL,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS syrup_ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      syrup_id INTEGER NOT NULL,
      cod_aje TEXT NOT NULL,
      cod_emb TEXT NOT NULL,
      description TEXT NOT NULL,
      um TEXT NOT NULL,
      factor REAL NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      substitute_of_id INTEGER,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (syrup_id) REFERENCES syrups(id) ON DELETE CASCADE,
      FOREIGN KEY (substitute_of_id) REFERENCES syrup_ingredients(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'envasado',
      syrup_id INTEGER,
      units_per_package REAL NOT NULL DEFAULT 1,
      syrup_factor REAL NOT NULL DEFAULT 0,
      water_factor REAL NOT NULL DEFAULT 0,
      yield_factor REAL NOT NULL DEFAULT 0.997,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (syrup_id) REFERENCES syrups(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS product_ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      cod_aje TEXT NOT NULL,
      cod_emb TEXT NOT NULL,
      description TEXT NOT NULL,
      um TEXT NOT NULL,
      factor REAL NOT NULL,
      category TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      substitute_of_id INTEGER,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (substitute_of_id) REFERENCES product_ingredients(id) ON DELETE SET NULL
    );
  `);
}

export function persistDatabase(): void {
  if (!db) return;
  const data = db.export();
  localStorage.setItem(STORAGE_KEY, uint8ToBase64(data));
  localStorage.setItem(
    META_KEY,
    JSON.stringify({ savedAt: new Date().toISOString(), version: 1 }),
  );
  notify();
}

export function getDatabase(): Database {
  if (!db) {
    throw new Error('La base de datos aún no está lista.');
  }
  return db;
}

export async function initDatabase(): Promise<Database> {
  if (db) return db;

  const sql = await loadSqlJs();
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    db = new sql.Database(base64ToUint8(saved));
  } else {
    db = new sql.Database();
    createSchema(db);
    seedDatabase(db);
    persistDatabase();
  }

  // Ensure foreign keys
  db.run('PRAGMA foreign_keys = ON;');
  return db;
}

export function resetDatabase(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(META_KEY);
  if (db) {
    db.close();
    db = null;
  }
}
