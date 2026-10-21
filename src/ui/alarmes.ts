import {
  acabat,
  afegirTemps,
  crearCronometre,
  engegar,
  enMarxa,
  pausar,
  reiniciar,
  type CronometreCuina,
} from '../domini';
import { textos } from '../textos/ca';
import { h } from './dom';

// Cronòmetres de cuina en marxa i avís quan s'acaben (so, vibració i un missatge a sobre de tot).
// Continuen encara que es canviï de pantalla; es desen al dispositiu per si es recarrega la pàgina.

const CLAU = 'piatto113:cronometres:v1';
const ta = textos.cuinar;

const cronometres = new Map<string, CronometreCuina>();
const subscriptors = new Set<() => void>();
let rellotge: number | undefined;
let audio: AudioContext | undefined;
let repeticioSo: number | undefined;

function desar(): void {
  try {
    window.localStorage.setItem(CLAU, JSON.stringify([...cronometres.values()]));
  } catch {
    // Sense emmagatzematge: els cronòmetres duren mentre la pàgina és oberta.
  }
}

function carregar(): void {
  try {
    const text = window.localStorage.getItem(CLAU);
    const llista = text ? (JSON.parse(text) as CronometreCuina[]) : [];
    for (const c of Array.isArray(llista) ? llista : []) {
      if (c && typeof c.id === 'string' && typeof c.duradaSegons === 'number') cronometres.set(c.id, c);
    }
  } catch {
    // Dades malmeses: es comença sense cronòmetres.
  }
}

const avisar = (): void => subscriptors.forEach((f) => f());

/** El navegador només deixa sonar després d'un toc de l'usuari: es prepara en engegar un cronòmetre. */
function prepararSo(): void {
  try {
    const Context = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Context) return;
    audio ??= new Context();
    if (audio.state === 'suspended') void audio.resume();
  } catch {
    audio = undefined;
  }
}

/** Tres pitets curts. */
function sonar(): void {
  if (!audio) return;
  const inici = audio.currentTime + 0.05;
  for (let i = 0; i < 3; i++) {
    const osc = audio.createOscillator();
    const guany = audio.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    const t = inici + i * 0.35;
    guany.gain.setValueAtTime(0.0001, t);
    guany.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
    guany.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    osc.connect(guany).connect(audio.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  }
}

function aturarSo(): void {
  if (repeticioSo !== undefined) window.clearInterval(repeticioSo);
  repeticioSo = undefined;
}

// ——— Avís a pantalla ———

let capa: HTMLElement | null = null;

function pendentsDAvis(): CronometreCuina[] {
  const ara = Date.now();
  return [...cronometres.values()].filter((c) => c.acabaA !== null && acabat(c, ara) && !c.avisat);
}

function mostrarAvis(): void {
  const acabats = pendentsDAvis();
  if (acabats.length === 0) return;
  capa?.remove();
  const tancar = (): void => {
    for (const c of acabats) cronometres.set(c.id, { ...c, avisat: true });
    desar();
    aturarSo();
    capa?.remove();
    capa = null;
    avisar();
  };
  const unMinutMes = (): void => {
    const ara = Date.now();
    for (const c of acabats) cronometres.set(c.id, afegirTemps(c, 60, ara));
    desar();
    aturarSo();
    capa?.remove();
    capa = null;
    assegurarRellotge();
    avisar();
  };
  const boto = h('button', { type: 'button', class: 'boto boto--principal boto--gran', onclick: tancar }, ta.entesos);
  capa = h(
    'div',
    { class: 'alarma', role: 'alertdialog', 'aria-modal': 'true', 'aria-labelledby': 'alarma-titol' },
    h(
      'div',
      { class: 'alarma__caixa' },
      h('p', { class: 'alarma__icona', 'aria-hidden': 'true' }, '⏰'),
      h('h2', { class: 'alarma__titol', id: 'alarma-titol' }, ta.acabat),
      ...acabats.map((c) => h('p', { class: 'alarma__nom' }, c.nom)),
      boto,
      h('button', { type: 'button', class: 'boto boto--secundari', onclick: unMinutMes }, ta.unMinutMes),
    ),
  );
  document.body.append(capa);
  boto.focus();
  sonar();
  if ('vibrate' in navigator) navigator.vibrate([300, 150, 300, 150, 300]);
  aturarSo();
  let vegades = 0;
  repeticioSo = window.setInterval(() => {
    // Torna a sonar cada pocs segons durant un minut, fins que es toca «Entesos».
    if (++vegades > 20) aturarSo();
    else sonar();
  }, 3000);
}

// ——— Rellotge ———

function tic(): void {
  const ara = Date.now();
  if (pendentsDAvis().length > 0 && !capa) mostrarAvis();
  if (![...cronometres.values()].some((c) => enMarxa(c, ara))) {
    window.clearInterval(rellotge);
    rellotge = undefined;
  }
  avisar();
}

function assegurarRellotge(): void {
  if (rellotge === undefined) rellotge = window.setInterval(tic, 250);
}

// ——— API ———

export function obtenirCronometre(receptaId: string, pas: number, nom: string, duradaSegons: number): CronometreCuina {
  const id = `${receptaId}:${pas}`;
  return cronometres.get(id) ?? crearCronometre(receptaId, pas, nom, duradaSegons);
}

export function engegarCronometre(c: CronometreCuina): void {
  prepararSo();
  cronometres.set(c.id, engegar(c, Date.now()));
  desar();
  assegurarRellotge();
  avisar();
}

export function pausarCronometre(c: CronometreCuina): void {
  cronometres.set(c.id, pausar(cronometres.get(c.id) ?? c, Date.now()));
  desar();
  avisar();
}

export function reiniciarCronometre(c: CronometreCuina): void {
  cronometres.delete(c.id);
  cronometres.set(c.id, reiniciar(c));
  desar();
  avisar();
}

export function afegirMinut(c: CronometreCuina): void {
  cronometres.set(c.id, afegirTemps(cronometres.get(c.id) ?? c, 60, Date.now()));
  desar();
  assegurarRellotge();
  avisar();
}

/** Cronòmetres en marxa o pausats a mitges (per a la barra de cronòmetres actius). */
export function cronometresActius(): CronometreCuina[] {
  const ara = Date.now();
  return [...cronometres.values()].filter(
    (c) => enMarxa(c, ara) || (c.acabaA === null && c.restantAturat > 0 && c.restantAturat < c.duradaSegons),
  );
}

/** Es crida a cada canvi i, mentre hi ha cronòmetres en marxa, unes quatre vegades per segon. */
export function subscriure(f: () => void): () => void {
  subscriptors.add(f);
  return () => subscriptors.delete(f);
}

carregar();
if ([...cronometres.values()].some((c) => c.acabaA !== null)) assegurarRellotge();
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') tic();
});
