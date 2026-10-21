import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { fusionar } from '../domini';
import { COLUMNES, esborrarDades, llegirDades, posarDades, quanEsDesi, type Columna } from './emmagatzematge';

// Inici de sessió amb codi per correu i còpia de les dades al compte (Supabase, taula `dades_usuari`).
// Sense les variables VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY (p. ex. en desenvolupament), l'app funciona
// només amb el que es desa al mòbil i no demana iniciar sessió.
// Amb el mateix correu a dos mòbils, tots dos veuen les mateixes dades.

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const clau = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Hi ha Supabase configurat: cal iniciar sessió i les dades es desen al compte. */
export const nuvolActiu = Boolean(url && clau);

const client: SupabaseClient | null = nuvolActiu
  ? createClient(url!, clau!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'piatto113:sessio' },
    })
  : null;

const TAULA = 'dades_usuari';
/** Canvis fets al mòbil que encara no s'han pogut enviar (sobreviuen si es tanca l'app). */
const CLAU_PENDENTS = 'piatto113:pendents:v1';
/** Espera després d'un canvi abans d'enviar-lo, per enviar junts els canvis seguits. */
const ESPERA_MS = 700;

export interface Usuari {
  id: string;
  correu: string;
}

/** Motius d'error que la pantalla explica a l'usuari. */
export type ErrorEntrada = 'correu' | 'codi' | 'massa-intents' | 'no-autoritzat' | 'connexio' | 'desconegut';

// ——— Sessió ———

/** Usuari amb sessió iniciada en aquest mòbil (funciona sense connexió). */
export async function usuariActual(): Promise<Usuari | null> {
  if (!client) return null;
  const { data } = await client.auth.getSession();
  const u = data.session?.user;
  return u ? { id: u.id, correu: u.email ?? '' } : null;
}

function errorDe(e: unknown): ErrorEntrada {
  const { code, status, name } = (e ?? {}) as { code?: string; status?: number; name?: string };
  if (code === 'otp_expired') return 'codi';
  if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit' || status === 429) return 'massa-intents';
  if (code === 'email_address_not_authorized') return 'no-autoritzat';
  if (code === 'email_address_invalid' || code === 'validation_failed') return 'correu';
  if (name === 'AuthRetryableFetchError' || status === 0 || (typeof navigator !== 'undefined' && !navigator.onLine)) return 'connexio';
  return 'desconegut';
}

/** Envia un codi al correu. Si el correu no té compte, se'n crea un. */
export async function enviarCodi(correu: string): Promise<ErrorEntrada | null> {
  if (!client) return 'desconegut';
  try {
    const { error } = await client.auth.signInWithOtp({ email: correu, options: { shouldCreateUser: true } });
    return error ? errorDe(error) : null;
  } catch (e) {
    return errorDe(e);
  }
}

/** Comprova el codi; si és bo, la sessió queda iniciada. */
export async function verificarCodi(correu: string, codi: string): Promise<ErrorEntrada | null> {
  if (!client) return 'desconegut';
  try {
    const { error } = await client.auth.verifyOtp({ email: correu, token: codi, type: 'email' });
    if (!error) return null;
    // Un codi equivocat i un de caducat tenen el mateix missatge per a l'usuari.
    const motiu = errorDe(error);
    return motiu === 'desconegut' && error.status === 403 ? 'codi' : motiu;
  } catch (e) {
    return errorDe(e);
  }
}

/** Tanca la sessió en aquest mòbil i n'esborra les dades (continuen al compte). */
export async function tancarSessio(): Promise<void> {
  aturarEnviament();
  if (client) {
    try {
      await client.auth.signOut({ scope: 'local' });
    } catch {
      // Sense connexió: la sessió local s'esborra igualment.
    }
  }
  esborrarDades();
  desarPendents([]);
}

// ——— Sincronització ———

function carregarPendents(): Columna[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(CLAU_PENDENTS) ?? '[]') as unknown;
    return Array.isArray(v) ? COLUMNES.filter((c) => v.includes(c)) : [];
  } catch {
    return [];
  }
}

function desarPendents(pendents: readonly Columna[]): void {
  try {
    if (pendents.length === 0) window.localStorage.removeItem(CLAU_PENDENTS);
    else window.localStorage.setItem(CLAU_PENDENTS, JSON.stringify(pendents));
  } catch {
    // Sense emmagatzematge.
  }
}

let temporitzador: ReturnType<typeof setTimeout> | null = null;
let enCurs: Promise<boolean> | null = null;
let avisarCanvis: (() => void) | null = null;
let avisarEstat: (() => void) | null = null;
let escoltant = false;

function aturarEnviament(): void {
  if (temporitzador) clearTimeout(temporitzador);
  temporitzador = null;
}

/** Hi ha canvis del mòbil per enviar (p. ex. sense connexió). */
export const hiHaPendents = (): boolean => carregarPendents().length > 0;

/** Envia al compte les dades indicades. Retorna si ha anat bé. */
async function pujar(usuari: Usuari, columnes: readonly Columna[]): Promise<boolean> {
  if (!client || columnes.length === 0) return true;
  const local = llegirDades();
  const fila: Record<string, unknown> = { usuari_id: usuari.id };
  for (const c of columnes) fila[c] = local[c];
  try {
    const { error } = await client.from(TAULA).upsert(fila, { onConflict: 'usuari_id' });
    if (error) return false;
  } catch {
    return false; // Sense connexió: queden pendents.
  }
  // Només es treuen de pendents les que s'han enviat (n'hi pot haver de noves mentrestant).
  const enviades = new Set(columnes);
  const ara = llegirDades();
  desarPendents(carregarPendents().filter((c) => !enviades.has(c) || JSON.stringify(ara[c]) !== JSON.stringify(local[c])));
  return true;
}

/**
 * Ajunta les dades del mòbil i les del compte (vegeu domini/sincronitzacio.ts).
 * Retorna `true` si han canviat les dades del mòbil (cal tornar a pintar la pantalla).
 */
export function sincronitzar(): Promise<boolean> {
  if (enCurs) return enCurs;
  enCurs = (async () => {
    try {
      const usuari = await usuariActual();
      if (!client || !usuari) return false;
      aturarEnviament();
      // Primer s'envia el que estava pendent, perquè no el trepitgi el que hi ha al núvol.
      await pujar(usuari, carregarPendents());
      const { data, error } = await client.from(TAULA).select(COLUMNES.join(',')).eq('usuari_id', usuari.id).maybeSingle();
      if (error) return false;
      const remot = (data as Record<Columna, unknown> | null) ?? null;
      const { aplicar, pujar: perPujar } = fusionar(COLUMNES, llegirDades(), remot, carregarPendents());
      const canvis = Object.keys(aplicar).length > 0;
      if (canvis) posarDades(aplicar);
      if (perPujar.length > 0) {
        desarPendents([...new Set([...carregarPendents(), ...perPujar])]);
        await pujar(usuari, perPujar);
      }
      return canvis;
    } catch {
      return false;
    } finally {
      enCurs = null;
      avisarEstat?.();
    }
  })();
  return enCurs;
}

async function sincronitzarIAvisar(): Promise<void> {
  if (await sincronitzar()) avisarCanvis?.();
}

/**
 * Comença a copiar les dades al compte: cada canvi s'envia al cap d'un moment, i en tornar a l'app
 * (o recuperar la connexió) es baixen els canvis fets des d'un altre mòbil.
 * @param quanCanviin es crida quan arriben dades noves del compte.
 * @param quanCanviiEstat es crida quan canvia si hi ha canvis pendents d'enviar.
 */
export function iniciarSincronitzacio(quanCanviin: () => void, quanCanviiEstat: () => void): void {
  if (!client) return;
  avisarCanvis = quanCanviin;
  avisarEstat = quanCanviiEstat;
  quanEsDesi((columna) => {
    const pendents = carregarPendents();
    if (!pendents.includes(columna)) desarPendents([...pendents, columna]);
    aturarEnviament();
    temporitzador = setTimeout(() => {
      temporitzador = null;
      void usuariActual().then(async (u) => {
        if (u) await pujar(u, carregarPendents());
        avisarEstat?.();
      });
    }, ESPERA_MS);
  });
  if (!escoltant) escoltarCanvisDeConnexio();
  void sincronitzarIAvisar();
}

function escoltarCanvisDeConnexio(): void {
  escoltant = true;
  document.addEventListener('visibilitychange', () => {
    if (!avisarCanvis) return;
    if (document.visibilityState === 'visible') void sincronitzarIAvisar();
    // En sortir de l'app, s'envia el que quedi sense esperar.
    else if (temporitzador) {
      aturarEnviament();
      void usuariActual().then((u) => (u ? pujar(u, carregarPendents()) : true));
    }
  });
  window.addEventListener('online', () => {
    if (avisarCanvis) void sincronitzarIAvisar();
  });
}

/** Deixa de copiar dades (en tancar la sessió). */
export function aturarSincronitzacio(): void {
  aturarEnviament();
  quanEsDesi(null);
  avisarCanvis = null;
  avisarEstat = null;
}
