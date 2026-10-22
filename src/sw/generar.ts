// Generador del service worker (s'executa en fer el build, des de vite.config.ts; no forma part de l'app).
//
// L'app funciona sense connexió: en instal·lar-se, el service worker desa a la memòria cau tots els fitxers
// del build (la pàgina, el JS, el CSS, el manifest i les icones). Després, cada fitxer es serveix des de la
// memòria cau, i la pàgina també: així s'obre de seguida encara que la cobertura sigui dolenta.
// Les crides a Supabase (un altre domini) no passen pel service worker: si no hi ha connexió, els canvis
// queden pendents al mòbil i s'envien en tornar-n'hi, com fins ara.
// Quan es publica una versió nova, el service worker nou es descarrega sol, esborra la memòria cau vella
// i la versió nova es veu el pròxim cop que s'obre l'app.

/** Codi del service worker amb la llista de fitxers a desar i la versió (canvia a cada build diferent). */
export function codiServiceWorker(fitxers: readonly string[], versio: string): string {
  const llista = JSON.stringify([...new Set(['/', ...fitxers])].sort());
  return `// Generat per src/sw/generar.ts en fer el build. No l'editis a mà.
const CACHE = 'piatto113-${versio}';
const FITXERS = ${llista};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(FITXERS.map((f) => new Request(f, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((claus) => Promise.all(claus.filter((c) => c.startsWith('piatto113-') && c !== CACHE).map((c) => caches.delete(c))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Supabase i qualsevol altre domini: directament a la xarxa.
  if (url.origin !== self.location.origin) return;
  // La pàgina (qualsevol adreça de l'app) és sempre la mateixa: index.html.
  const clau = req.mode === 'navigate' ? '/index.html' : url.pathname;
  event.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(clau).then((desat) => desat || fetch(req)),
    ),
  );
});
`;
}
