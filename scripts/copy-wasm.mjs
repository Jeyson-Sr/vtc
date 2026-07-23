import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm');
const destDir = join(root, 'public', 'assets');
const dest = join(destDir, 'sql-wasm.wasm');

if (!existsSync(src)) {
  console.warn('sql.js wasm not found yet; skip copy');
  process.exit(0);
}

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log('Copied sql-wasm.wasm to public/assets');
