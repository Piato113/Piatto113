import { generadorAleatori } from './aleatori';
import type { Cataleg } from './cataleg';
import { costRecepta } from './cost';
import { racionsEfectives } from './escalat';
import { apatsMarcats } from './graella';
import { generarLlista, type LlistaCompra } from './llista';
import type { ApatPlanificat, Avis, ConfiguracioFamilia, Graella, Recepta } from './tipus';

export interface EntradaPlanificador {
  cataleg: Cataleg;
  configuracio: ConfiguracioFamilia;
  graella: Graella;
  /** Mateixa llavor + mateixes dades = mateix menú. */
  llavor: number;
}

export interface PlaSetmanal {
  apats: ApatPlanificat[];
  llista: LlistaCompra;
  racionsCentesimes: number;
  avisos: Avis[];
}

/** Pes extra de cada etiqueta preferida en el sorteig. */
const PES_PREFERIDA = 2;

/**
 * Receptes que compleixen la configuració:
 * cap ingredient exclòs, dins del temps màxim i amb totes les etiquetes obligatòries.
 * Ordenades per identificador perquè el resultat no depengui de l'ordre del catàleg.
 */
export function filtrarReceptes(cataleg: Cataleg, configuracio: ConfiguracioFamilia): Recepta[] {
  const exclosos = new Set(configuracio.exclosos);
  return [...cataleg.receptes.values()]
    .filter((r) => !r.ingredients.some((l) => exclosos.has(l.ingredientId)))
    .filter((r) => configuracio.tempsMaximMinuts === null || r.tempsMinuts <= configuracio.tempsMaximMinuts)
    .filter((r) => configuracio.etiquetesObligatories.every((e) => r.etiquetes.includes(e)))
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

function pes(recepta: Recepta, preferides: readonly string[]): number {
  return 1 + PES_PREFERIDA * recepta.etiquetes.filter((e) => preferides.includes(e)).length;
}

/**
 * Sorteig ponderat sense repetir fins que s'acaben les receptes; després torna a començar,
 * evitant que la mateixa recepta surti dos àpats seguits.
 */
function triar(candidates: Recepta[], quantes: number, preferides: readonly string[], aleatori: () => number): string[] {
  const triades: string[] = [];
  let pendents: Recepta[] = [];

  while (triades.length < quantes) {
    if (pendents.length === 0) pendents = [...candidates];
    const anterior = triades[triades.length - 1];
    const elegibles = pendents.length > 1 ? pendents.filter((r) => r.id !== anterior) : pendents;
    const total = elegibles.reduce((s, r) => s + pes(r, preferides), 0);
    let punt = aleatori() * total;
    const triada = elegibles.find((r) => (punt -= pes(r, preferides)) < 0) ?? elegibles[elegibles.length - 1]!;
    pendents.splice(pendents.indexOf(triada), 1);
    triades.push(triada.id);
  }
  return triades;
}

/**
 * Planifica la setmana:
 * 1. filtra les receptes;
 * 2. en tria una per àpat marcat, sense repetir mentre n'hi hagi prou, amb la llavor;
 * 3. si el cost de compra supera el pressupost, substitueix la recepta més cara
 *    per la candidata més barata disponible, fins que hi càpiga o ja no es pugui abaratir.
 */
export function planificar({ cataleg, configuracio, graella, llavor }: EntradaPlanificador): PlaSetmanal {
  const racionsCentesimes = racionsEfectives(configuracio.persones);
  const forats = apatsMarcats(graella);
  const avisos: Avis[] = [];
  const buit = (): PlaSetmanal => ({
    apats: [],
    llista: generarLlista(cataleg, [], racionsCentesimes),
    racionsCentesimes,
    avisos,
  });

  if (forats.length === 0) {
    avisos.push({ codi: 'cap-apat-marcat' });
    return buit();
  }

  const candidates = filtrarReceptes(cataleg, configuracio);
  if (candidates.length === 0) {
    avisos.push({ codi: 'cap-recepta-valida' });
    return buit();
  }

  const ambRepeticions = candidates.length < forats.length;
  if (ambRepeticions) {
    avisos.push({ codi: 'receptes-repetides', disponibles: candidates.length, necessaries: forats.length });
  }

  const aleatori = generadorAleatori(llavor);
  const triades = triar(candidates, forats.length, configuracio.etiquetesPreferides, aleatori);

  const cost = new Map(candidates.map((r) => [r.id, costRecepta(cataleg, r, racionsCentesimes)]));
  const costDe = (id: string): number => cost.get(id) ?? 0;
  let llista = generarLlista(cataleg, triades, racionsCentesimes);

  const pressupost = configuracio.pressupostCentims;
  if (pressupost !== null) {
    while (llista.totalCompraCentims > pressupost) {
      const usades = new Set(triades);
      const disponibles = ambRepeticions ? candidates : candidates.filter((r) => !usades.has(r.id));
      const mesBarata = disponibles.reduce<Recepta | null>(
        (millor, r) => (millor === null || costDe(r.id) < costDe(millor.id) ? r : millor),
        null,
      );

      // La més cara de les triades que es pugui abaratir (a igualtat, la primera de la setmana).
      let index = -1;
      for (let i = 0; i < triades.length; i++) {
        const id = triades[i]!;
        if (mesBarata && costDe(mesBarata.id) < costDe(id) && (index === -1 || costDe(id) > costDe(triades[index]!))) {
          index = i;
        }
      }
      if (index === -1 || !mesBarata) {
        avisos.push({
          codi: 'pressupost-impossible',
          pressupostCentims: pressupost,
          minimCentims: llista.totalCompraCentims,
        });
        break;
      }

      triades[index] = mesBarata.id;
      llista = generarLlista(cataleg, triades, racionsCentesimes);
    }
  }

  if (llista.senseCost.length > 0) avisos.push({ codi: 'sense-preu', ingredientIds: llista.senseCost });

  const apats = forats.map((forat, i) => ({ ...forat, receptaId: triades[i]! }));
  return { apats, llista, racionsCentesimes, avisos };
}
