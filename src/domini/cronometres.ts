// Cronòmetres de cuina: lògica pura, sense rellotge propi. Tot es calcula a partir de l'hora que es passa
// (`ara`, en mil·lisegons), així no s'endarrereixen encara que el mòbil aturi la pàgina un moment.

export interface CronometreCuina {
  /** Identificador estable: recepta i pas («canelons:4»). */
  id: string;
  receptaId: string;
  /** Número de pas (comença per 1). */
  pas: number;
  nom: string;
  /** Durada total en segons. */
  duradaSegons: number;
  /** Quan s'acaba (ms des de 1970) si està en marxa; `null` si està aturat. */
  acabaA: number | null;
  /** Segons que queden quan està aturat (pausat o sense engegar). */
  restantAturat: number;
  /** Ja ha avisat que s'ha acabat. */
  avisat: boolean;
}

export const idCronometre = (receptaId: string, pas: number): string => `${receptaId}:${pas}`;

export function crearCronometre(receptaId: string, pas: number, nom: string, duradaSegons: number): CronometreCuina {
  return { id: idCronometre(receptaId, pas), receptaId, pas, nom, duradaSegons, acabaA: null, restantAturat: duradaSegons, avisat: false };
}

/** Segons que queden (enter, arrodonit cap amunt; 0 si s'ha acabat). */
export function restant(c: CronometreCuina, ara: number): number {
  if (c.acabaA === null) return Math.max(0, Math.ceil(c.restantAturat));
  return Math.max(0, Math.ceil((c.acabaA - ara) / 1000));
}

export const enMarxa = (c: CronometreCuina, ara: number): boolean => c.acabaA !== null && restant(c, ara) > 0;
export const acabat = (c: CronometreCuina, ara: number): boolean => restant(c, ara) === 0;

/** Engega o continua. Si ja s'havia acabat, torna a començar des del principi. */
export function engegar(c: CronometreCuina, ara: number): CronometreCuina {
  const segons = acabat(c, ara) ? c.duradaSegons : c.acabaA === null ? c.restantAturat : restant(c, ara);
  return { ...c, acabaA: ara + segons * 1000, restantAturat: segons, avisat: false };
}

export function pausar(c: CronometreCuina, ara: number): CronometreCuina {
  if (c.acabaA === null) return c;
  return { ...c, acabaA: null, restantAturat: Math.max(0, (c.acabaA - ara) / 1000) };
}

export function reiniciar(c: CronometreCuina): CronometreCuina {
  return { ...c, acabaA: null, restantAturat: c.duradaSegons, avisat: false };
}

/** Afegeix (o treu, amb un valor negatiu) temps a un cronòmetre, sense baixar de 0. */
export function afegirTemps(c: CronometreCuina, segons: number, ara: number): CronometreCuina {
  if (c.acabaA === null) return { ...c, restantAturat: Math.max(0, c.restantAturat + segons), avisat: false };
  // Si ja s'havia acabat, el temps afegit compta des d'ara («1 minut més»).
  const nou = Math.max(ara, Math.max(ara, c.acabaA) + segons * 1000);
  return { ...c, acabaA: nou, avisat: false };
}

/** «4:05», «12:00», «1:02:09». */
export function formatRellotge(segons: number): string {
  const s = Math.max(0, Math.round(segons));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = String(s % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${r}` : `${m}:${r}`;
}
