import { describe, expect, it } from 'vitest';
import { codiServiceWorker } from '../src/sw/generar.ts';

// Simula l'entorn d'un service worker (memòria cau, xarxa i esdeveniments) per provar el codi generat.
function entorn(enLinia: { valor: boolean }) {
  const caches = new Map<string, Map<string, string>>();
  const escoltes = new Map<string, (e: unknown) => void>();
  const xarxa = async (req: { url: string } | string): Promise<string> => {
    if (!enLinia.valor) throw new TypeError('Sense connexió');
    return `xarxa:${new URL(typeof req === 'string' ? req : req.url, 'https://piatto113.pages.dev').pathname}`;
  };
  const cacheApi = {
    open: async (nom: string) => {
      if (!caches.has(nom)) caches.set(nom, new Map());
      const c = caches.get(nom)!;
      return {
        addAll: async (reqs: { url: string }[]) => {
          for (const r of reqs) c.set(new URL(r.url, 'https://piatto113.pages.dev').pathname, await xarxa(r.url));
        },
        match: async (clau: string) => c.get(clau),
      };
    },
    keys: async () => [...caches.keys()],
    delete: async (nom: string) => caches.delete(nom),
  };
  const self = {
    location: { origin: 'https://piatto113.pages.dev' },
    addEventListener: (tipus: string, f: (e: unknown) => void) => escoltes.set(tipus, f),
    skipWaiting: async () => undefined,
    clients: { claim: async () => undefined },
  };
  class Request {
    url: string;
    constructor(url: string) {
      this.url = new URL(url, self.location.origin).href;
    }
  }
  const executar = (codi: string): void =>
    new Function('self', 'caches', 'fetch', 'Request', 'Response', codi)(self, cacheApi, xarxa, Request, { error: () => 'error' });
  const esdeveniment = async (tipus: string, dades: object = {}) => {
    let promesa: Promise<unknown> | undefined;
    let resposta: Promise<unknown> | undefined;
    escoltes.get(tipus)!({ ...dades, waitUntil: (p: Promise<unknown>) => (promesa = p), respondWith: (p: Promise<unknown>) => (resposta = p) });
    await promesa;
    return resposta ? await resposta : undefined;
  };
  return { caches, executar, esdeveniment };
}

const peticio = (url: string, mode = 'no-cors') => ({ request: { method: 'GET', url, mode } });

describe('service worker', () => {
  const fitxers = ['/index.html', '/assets/index-abc.js', '/assets/index-abc.css', '/manifest.webmanifest', '/icons/icona-192.png'];

  it('desa tots els fitxers en instal·lar-se i esborra les versions velles', async () => {
    const enLinia = { valor: true };
    const sw = entorn(enLinia);
    sw.caches.set('piatto113-vella', new Map());
    sw.caches.set('una-altra-cosa', new Map());
    sw.executar(codiServiceWorker(fitxers, 'v2'));
    await sw.esdeveniment('install');
    await sw.esdeveniment('activate');
    expect([...sw.caches.keys()].sort()).toEqual(['piatto113-v2', 'una-altra-cosa']);
    expect([...sw.caches.get('piatto113-v2')!.keys()].sort()).toEqual(['/', ...fitxers].sort());
  });

  it('sense connexió, obre l’app i els fitxers des de la memòria cau', async () => {
    const enLinia = { valor: true };
    const sw = entorn(enLinia);
    sw.executar(codiServiceWorker(fitxers, 'v1'));
    await sw.esdeveniment('install');
    enLinia.valor = false;
    expect(await sw.esdeveniment('fetch', peticio('https://piatto113.pages.dev/compra', 'navigate'))).toBe('xarxa:/index.html');
    expect(await sw.esdeveniment('fetch', peticio('https://piatto113.pages.dev/assets/index-abc.js'))).toBe('xarxa:/assets/index-abc.js');
  });

  it('no toca les crides a Supabase ni les que no són GET', async () => {
    const sw = entorn({ valor: true });
    sw.executar(codiServiceWorker(fitxers, 'v1'));
    await sw.esdeveniment('install');
    expect(await sw.esdeveniment('fetch', peticio('https://zfdhdexfumevrfzuopgl.supabase.co/rest/v1/dades_usuari'))).toBeUndefined();
    expect(await sw.esdeveniment('fetch', { request: { method: 'POST', url: 'https://piatto113.pages.dev/x', mode: 'cors' } })).toBeUndefined();
  });
});
