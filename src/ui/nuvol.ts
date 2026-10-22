import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { fusionar, llegirEstadistiques, type Estadistiques } from '../domini';
import { COLUMNES, esborrarDades, llegirDades, posarDades, quanEsDesi, type Columna } from './emmagatzematge';

// Inici de sessió amb correu i contrasenya i còpia de les dades al compte (Supabase, taula `dades_usuari`).
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
export type ErrorEntrada =
  | 'correu'
  | 'credencials'
  | 'no-confirmat'
  | 'contrasenya-curta'
  | 'ja-existeix'
  | 'registre-tancat'
  | 'no-autoritzat'
  | 'massa-intents'
  | 'connexio'
  | 'desconegut';

/** Mínim de caràcters de la contrasenya (el de Supabase per defecte és 6). */
export const MIN_CONTRASENYA = 6;

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
  if (code === 'invalid_credentials') return 'credencials';
  if (code === 'email_not_confirmed') return 'no-confirmat';
  if (code === 'weak_password') return 'contrasenya-curta';
  if (code === 'user_already_exists' || code === 'email_exists') return 'ja-existeix';
  if (code === 'signup_disabled' || code === 'email_provider_disabled') return 'registre-tancat';
  if (code === 'email_address_not_authorized') return 'no-autoritzat';
  if (code === 'over_request_rate_limit' || code === 'over_email_send_rate_limit' || status === 429) return 'massa-intents';
  if (code === 'email_address_invalid' || code === 'validation_failed') return 'correu';
  if (name === 'AuthRetryableFetchError' || status === 0 || (typeof navigator !== 'undefined' && !navigator.onLine)) return 'connexio';
  // Un correu o una contrasenya incorrectes de versions antigues de Supabase arriben sense codi.
  if (status === 400) return 'credencials';
  return 'desconegut';
}

/** Entra amb correu i contrasenya. */
export async function entrar(correu: string, contrasenya: string): Promise<ErrorEntrada | null> {
  if (!client) return 'desconegut';
  try {
    const { error } = await client.auth.signInWithPassword({ email: correu, password: contrasenya });
    return error ? errorDe(error) : null;
  } catch (e) {
    return errorDe(e);
  }
}

/**
 * Crea un compte nou. Si Supabase té desactivat «Confirm email», la sessió queda iniciada de seguida;
 * si el té activat, envia un correu per confirmar-lo i `confirmar` és `true`.
 */
export async function registrar(correu: string, contrasenya: string): Promise<{ error: ErrorEntrada | null; confirmar: boolean }> {
  if (!client) return { error: 'desconegut', confirmar: false };
  try {
    const { data, error } = await client.auth.signUp({ email: correu, password: contrasenya });
    if (error) return { error: errorDe(error), confirmar: false };
    // Amb la confirmació activada, un correu que ja té compte torna un usuari sense identitats (per no revelar-ho).
    if (data.user && data.user.identities?.length === 0) return { error: 'ja-existeix', confirmar: false };
    return { error: null, confirmar: !data.session };
  } catch (e) {
    return { error: errorDe(e), confirmar: false };
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

/**
 * La columna `valoracions` és nova (supabase/003_valoracions.sql). Mentre no s'hagi afegit a la base de dades,
 * les valoracions es queden al mòbil (pendents d'enviar) i la resta se sincronitza com sempre.
 */
let ambValoracions = true;
const columnesNuvol = (): Columna[] => COLUMNES.filter((c) => ambValoracions || c !== 'valoracions');
const faltaValoracions = (error: { message?: string } | null): boolean =>
  ambValoracions && error !== null && /valoracions/i.test(error.message ?? '');

/** Hi ha canvis del mòbil per enviar (p. ex. sense connexió). */
export const hiHaPendents = (): boolean => carregarPendents().some((c) => columnesNuvol().includes(c));

/** Envia al compte les dades indicades. Retorna si ha anat bé. */
async function pujar(usuari: Usuari, columnes: readonly Columna[]): Promise<boolean> {
  const disponibles = columnesNuvol();
  const aEnviar = columnes.filter((c) => disponibles.includes(c));
  if (!client || aEnviar.length === 0) return true;
  const local = llegirDades();
  const fila: Record<string, unknown> = { usuari_id: usuari.id };
  for (const c of aEnviar) fila[c] = local[c];
  try {
    const { error } = await client.from(TAULA).upsert(fila, { onConflict: 'usuari_id' });
    if (error) {
      if (!faltaValoracions(error)) return false;
      ambValoracions = false;
      return pujar(usuari, columnes);
    }
  } catch {
    return false; // Sense connexió: queden pendents.
  }
  // Només es treuen de pendents les que s'han enviat (n'hi pot haver de noves mentrestant).
  const enviades = new Set(aEnviar);
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
      const llegir = () => client!.from(TAULA).select(columnesNuvol().join(',')).eq('usuari_id', usuari.id).maybeSingle();
      let { data, error } = await llegir();
      if (error && faltaValoracions(error)) {
        ambValoracions = false;
        ({ data, error } = await llegir());
      }
      if (error) return false;
      const remot = (data as Record<Columna, unknown> | null) ?? null;
      const { aplicar, pujar: perPujar } = fusionar(columnesNuvol(), llegirDades(), remot, carregarPendents());
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

// ——— Xifres del rètol (supabase/004_estadistiques.sql) ———
// Mentre no s'hagin creat les funcions a la base de dades, no es mostren ni es compten: cap error a la pantalla.

/** Usuaris i menús fets de tota l'app, o `null` si no es poden saber (sense sessió, sense connexió o sense l'SQL). */
export async function demanarEstadistiques(): Promise<Estadistiques | null> {
  if (!client || !(await usuariActual())) return null;
  try {
    const { data, error } = await client.rpc('estadistiques_app');
    return error ? null : llegirEstadistiques(data);
  } catch {
    return null;
  }
}

/** Suma un menú fet al comptador. Si no es pot (sense connexió o sense l'SQL), no passa res. */
export async function comptarMenu(): Promise<void> {
  if (!client || !(await usuariActual())) return;
  try {
    await client.rpc('sumar_menu');
  } catch {
    // No importa: és només una xifra.
  }
}

/** Deixa de copiar dades (en tancar la sessió). */
export function aturarSincronitzacio(): void {
  aturarEnviament();
  quanEsDesi(null);
  avisarCanvis = null;
  avisarEstat = null;
}
