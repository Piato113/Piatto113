// Generador del service worker (s'executa en fer el build, des de vite.config.ts; no forma part de l'app).
//
// L'app funciona sense connexió: en instal·lar-se, el service worker desa a la memòria cau tots els fitxers
// del build (la pàgina, el JS, el CSS, el manifest i les icones). Després, cada fitxer es serveix des de la
// memòria cau. La pàgina es demana primer a la xarxa (així s'agafa sempre la versió bona) i, si no
// respon en 3 segons o no hi ha connexió, es fa servir la còpia desada.
// Cap resposta redirigida no es fa servir per obrir la pàgina: Chrome les rebutja.
// Les crides a Supabase (un altre domini) no passen pel service worker: si no hi ha connexió, els canvis
// queden pendents al mòbil i s'envien en tornar-n'hi, com fins ara.
// Quan es publica una versió nova, el service worker nou es descarrega sol, esborra la memòria cau vella
// i la versió nova es veu el pròxim cop que s'obre l'app.

/** Codi del service worker amb la llista de fitxers a desar i la versió (canvia a cada build diferent). */
export function codiServiceWorker(fitxers: readonly string[], versio: string): string {
  // index.html no es desa amb el seu nom: Cloudflare el redirigeix a «/», i Chrome no accepta una
  // resposta redirigida per obrir la pàgina (surt «No es pot accedir a aquest lloc web»).
  const llista = JSON.stringify([...new Set(['/', ...fitxers.filter((f) => f !== '/index.html')])].sort());
  return `// Generat per src/sw/generar.ts en fer el build. No l'editis a mà.
const CACHE = 'piatto113-${versio}';
const FITXERS = ${llista};
/** Temps màxim d'espera de la xarxa per obrir l'app abans de fer servir la còpia desada. */
const ESPERA_MS = 3000;

/** Una resposta que ha passat per una redirecció es copia en una de neta (si no, no serveix per obrir la pàgina). */
const neta = (r) =>
  r.redirected ? r.blob().then((cos) => new Response(cos, { status: r.status, statusText: r.statusText, headers: r.headers })) : r;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        // Si algun fitxer no es pot desar, la instal·lació continua igualment: l'app sempre ha de poder canviar
        // de versió (amb connexió, el que falti es demana a la xarxa).
        Promise.allSettled(
          FITXERS.map((f) =>
            fetch(new Request(f, { cache: 'reload' }))
              .then((r) => {
                if (!r.ok) throw new Error('No es pot desar ' + f);
                return neta(r);
              })
              .then((r) => cache.put(f, r)),
          ),
        ),
      )
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
  if (req.mode === 'navigate') {
    // Obrir l'app: primer la xarxa (si respon en pocs segons); si no, la còpia desada de la pàgina.
    event.respondWith(
      new Promise((resoldre) => {
        let fet = false;
        const desada = () =>
          caches
            .open(CACHE)
            .then((cache) => cache.match('/'))
            .then((r) => (r ? neta(r) : fetch(req)));
        const temps = setTimeout(() => {
          if (!fet) {
            fet = true;
            resoldre(desada().catch(() => Response.error()));
          }
        }, ESPERA_MS);
        fetch(req).then(
          (r) => {
            clearTimeout(temps);
            if (!fet) {
              fet = true;
              resoldre(r);
            }
          },
          () => {
            clearTimeout(temps);
            if (!fet) {
              fet = true;
              resoldre(desada().catch(() => Response.error()));
            }
          },
        );
      }),
    );
    return;
  }
  // La resta de fitxers (JS, CSS, icones): la còpia desada i, si no n'hi ha, la xarxa.
  event.respondWith(
    caches.open(CACHE).then((cache) => cache.match(url.pathname).then((desat) => desat || fetch(req))),
  );
});
`;
}
