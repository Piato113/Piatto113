import { describe, expect, it } from 'vitest';
import { codiServiceWorker } from '../src/sw/generar.ts';

const ORIGEN = 'https://piatto113.pages.dev';

/** Resposta simulada; `redirected` imita Cloudflare, que redirigeix /index.html a /. */
class Resposta {
  constructor(
    public cos: string,
    public opcions: { status?: number; statusText?: string; headers?: unknown; redirected?: boolean } = {},
  ) {}
  get ok() {
    return (this.opcions.status ?? 200) < 400;
  }
  get status() {
    return this.opcions.status ?? 200;
  }
  get statusText() {
    return '';
  }
  get headers() {
    return {};
  }
  get redirected() {
    return this.opcions.redirected === true;
  }
  blob() {
    return Promise.resolve(this.cos);
  }
  static error() {
    return new Resposta('error', { status: 599 });
  }
}

// Simula l'entorn d'un service worker (memòria cau, xarxa i esdeveniments) per provar el codi generat.
function entorn(xarxa: { enLinia: boolean; lenta?: boolean }) {
  const caches = new Map<string, Map<string, Resposta>>();
  const escoltes = new Map<string, (e: unknown) => void>();
  const cami = (r: { url: string } | string) => new URL(typeof r === 'string' ? r : r.url, ORIGEN).pathname;
  const fetch = (r: { url: string } | string): Promise<Resposta> => {
    if (!xarxa.enLinia) return Promise.reject(new TypeError('Sense connexió'));
    const p = cami(r);
    const resposta = new Resposta(`xarxa:${p === '/index.html' ? '/' : p}`, { redirected: p === '/index.html' });
    return xarxa.lenta ? new Promise((res) => setTimeout(() => res(resposta), 5000)) : Promise.resolve(resposta);
  };
  const cacheApi = {
    open: async (nom: string) => {
      if (!caches.has(nom)) caches.set(nom, new Map());
      const c = caches.get(nom)!;
      return {
        put: async (clau: string, r: Resposta) => void c.set(clau, r),
        match: async (clau: string) => c.get(clau),
      };
    },
    keys: async () => [...caches.keys()],
    delete: async (nom: string) => caches.delete(nom),
  };
  const self = {
    location: { origin: ORIGEN },
    addEventListener: (tipus: string, f: (e: unknown) => void) => escoltes.set(tipus, f),
    skipWaiting: async () => undefined,
    clients: { claim: async () => undefined },
  };
  class Request {
    url: string;
    constructor(url: string) {
      this.url = new URL(url, ORIGEN).href;
    }
  }
  const executar = (codi: string): void => new Function('self', 'caches', 'fetch', 'Request', 'Response', codi)(self, cacheApi, fetch, Request, Resposta);
  const esdeveniment = async (tipus: string, dades: object = {}) => {
    let promesa: Promise<unknown> | undefined;
    let resposta: Promise<unknown> | undefined;
    escoltes.get(tipus)!({ ...dades, waitUntil: (p: Promise<unknown>) => (promesa = p), respondWith: (p: Promise<unknown>) => (resposta = p) });
    await promesa;
    return resposta ? ((await resposta) as Resposta) : undefined;
  };
  return { caches, executar, esdeveniment };
}

const peticio = (url: string, mode = 'no-cors') => ({ request: { method: 'GET', url, mode } });
const fitxers = ['/index.html', '/assets/index-abc.js', '/assets/index-abc.css', '/manifest.webmanifest', '/icons/icona-192.png'];

describe('service worker', () => {
  it('desa tots els fitxers (sense /index.html) i esborra les versions velles', async () => {
    const sw = entorn({ enLinia: true });
    sw.caches.set('piatto113-vella', new Map());
    sw.caches.set('una-altra-cosa', new Map());
    sw.executar(codiServiceWorker(fitxers, 'v2'));
    await sw.esdeveniment('install');
    await sw.esdeveniment('activate');
    expect([...sw.caches.keys()].sort()).toEqual(['piatto113-v2', 'una-altra-cosa']);
    expect([...sw.caches.get('piatto113-v2')!.keys()].sort()).toEqual(['/', ...fitxers.filter((f) => f !== '/index.html')].sort());
  });

  it('cap resposta desada és redirigida', async () => {
    const sw = entorn({ enLinia: true });
    sw.executar(codiServiceWorker(['/index.html', '/assets/a.js'], 'v1'));
    await sw.esdeveniment('install');
    for (const r of sw.caches.get('piatto113-v1')!.values()) expect(r.redirected).toBe(false);
  });

  it('amb connexió, obre la pàgina de la xarxa', async () => {
    const sw = entorn({ enLinia: true });
    sw.executar(codiServiceWorker(fitxers, 'v1'));
    await sw.esdeveniment('install');
    const r = await sw.esdeveniment('fetch', peticio(`${ORIGEN}/`, 'navigate'));
    expect(r!.cos).toBe('xarxa:/');
  });

  it('sense connexió, obre l’app i els fitxers des de la memòria cau', async () => {
    const xarxa = { enLinia: true };
    const sw = entorn(xarxa);
    sw.executar(codiServiceWorker(fitxers, 'v1'));
    await sw.esdeveniment('install');
    xarxa.enLinia = false;
    const pagina = await sw.esdeveniment('fetch', peticio(`${ORIGEN}/#/compra`, 'navigate'));
    expect(pagina!.cos).toBe('xarxa:/');
    expect(pagina!.redirected).toBe(false);
    expect((await sw.esdeveniment('fetch', peticio(`${ORIGEN}/assets/index-abc.js`)))!.cos).toBe('xarxa:/assets/index-abc.js');
  });

  it('si la xarxa tarda, fa servir la còpia desada', async () => {
    const xarxa = { enLinia: true, lenta: false };
    const sw = entorn(xarxa);
    sw.executar(codiServiceWorker(fitxers, 'v1'));
    await sw.esdeveniment('install');
    xarxa.lenta = true;
    const inici = Date.now();
    const pagina = await sw.esdeveniment('fetch', peticio(`${ORIGEN}/`, 'navigate'));
    expect(pagina!.cos).toBe('xarxa:/');
    expect(Date.now() - inici).toBeLessThan(4500);
  }, 10_000);

  it('no toca les crides a Supabase ni les que no són GET', async () => {
    const sw = entorn({ enLinia: true });
    sw.executar(codiServiceWorker(fitxers, 'v1'));
    await sw.esdeveniment('install');
    expect(await sw.esdeveniment('fetch', peticio('https://zfdhdexfumevrfzuopgl.supabase.co/rest/v1/dades_usuari'))).toBeUndefined();
    expect(await sw.esdeveniment('fetch', { request: { method: 'POST', url: `${ORIGEN}/x`, mode: 'cors' } })).toBeUndefined();
  });
});
