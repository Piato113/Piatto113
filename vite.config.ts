/// <reference types="vitest/config" />
/// <reference types="node" />
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import { codiServiceWorker } from './src/sw/generar.ts';

/** Fitxers de la carpeta `public` (manifest i icones), amb el seu camí a la web. */
function fitxersPublics(carpeta = 'public'): string[] {
  return readdirSync(carpeta, { recursive: true, withFileTypes: true })
    .filter((f) => f.isFile())
    .map((f) => `/${relative(carpeta, join(f.parentPath, f.name)).split(sep).join('/')}`);
}

/** Afegeix `sw.js` al build amb la llista de tots els fitxers, perquè l'app funcioni sense connexió. */
function serviceWorker(): Plugin {
  return {
    name: 'piatto113-service-worker',
    apply: 'build',
    enforce: 'post',
    generateBundle(_opcions, bundle) {
      const publics = fitxersPublics();
      const fitxers = [...Object.keys(bundle).map((f) => `/${f}`), ...publics];
      // La versió canvia si canvia qualsevol fitxer: els del build porten el hash al nom; els públics, pel contingut.
      const hash = createHash('sha256');
      for (const f of [...fitxers].sort()) hash.update(f);
      for (const f of publics) hash.update(readFileSync(join('public', f)));
      const index = bundle['index.html'];
      if (index && index.type === 'asset') hash.update(String(index.source));
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: codiServiceWorker(fitxers, hash.digest('hex').slice(0, 12)) });
    },
  };
}

export default defineConfig({
  plugins: [serviceWorker()],
  build: {
    outDir: 'dist',
    target: 'es2022',
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
