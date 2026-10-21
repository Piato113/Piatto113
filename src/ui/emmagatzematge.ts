import {
  ALERGENS,
  APATS,
  DIES,
  graellaPerDefecte,
  llegirRespostes,
  type ApatPlanificat,
  type Avis,
  type Cataleg,
  type Graella,
  type RespostesQuestionari,
} from '../domini';

// Desa les respostes en aquest dispositiu fins que les dades vagin a Supabase.
// El navegador pot no deixar guardar (navegació privada, dades esborrades): l'app funciona igualment.

const CLAU = 'piatto113:respostes:v1';

export function carregarRespostes(): RespostesQuestionari | null {
  try {
    const text = window.localStorage.getItem(CLAU);
    return text ? llegirRespostes(JSON.parse(text), ALERGENS) : null;
  } catch {
    return null;
  }
}

export function desarRespostes(respostes: RespostesQuestionari): void {
  try {
    window.localStorage.setItem(CLAU, JSON.stringify(respostes));
  } catch {
    // Sense emmagatzematge: les respostes només duren mentre la pàgina és oberta.
  }
}

// ——— Menú de la setmana ———


export interface MenuDesat {
  /** Respostes amb què es va fer (en JSON): si canvien, el menú es torna a fer. */
  signatura: string;
  llavor: number;
  graella: Graella;
  apats: ApatPlanificat[];
  avisos: Avis[];
}

const CLAU_MENU = 'piatto113:menu:v1';
const CLAU_GRAELLA = 'piatto113:graella:v1';

function llegirGraella(valor: unknown): Graella | null {
  if (typeof valor !== 'object' || valor === null) return null;
  const v = valor as Record<string, unknown>;
  const graella = graellaPerDefecte();
  for (const dia of DIES) {
    const d = v[dia] as Record<string, unknown> | undefined;
    if (typeof d !== 'object' || d === null) return null;
    for (const apat of APATS) {
      if (typeof d[apat] !== 'boolean') return null;
      graella[dia][apat] = d[apat] as boolean;
    }
  }
  return graella;
}

export function carregarGraella(): Graella {
  try {
    const text = window.localStorage.getItem(CLAU_GRAELLA);
    return (text && llegirGraella(JSON.parse(text))) || graellaPerDefecte();
  } catch {
    return graellaPerDefecte();
  }
}

export function desarGraella(graella: Graella): void {
  try {
    window.localStorage.setItem(CLAU_GRAELLA, JSON.stringify(graella));
  } catch {
    // Sense emmagatzematge.
  }
}

/** Menú desat, si és vàlid amb el catàleg actual (les receptes poden haver canviat entre versions). */
export function carregarMenu(cataleg: Cataleg): MenuDesat | null {
  try {
    const text = window.localStorage.getItem(CLAU_MENU);
    if (!text) return null;
    const v = JSON.parse(text) as Partial<MenuDesat>;
    const graella = llegirGraella(v.graella);
    if (typeof v.signatura !== 'string' || typeof v.llavor !== 'number' || !graella || !Array.isArray(v.apats)) return null;
    const valids = v.apats.every(
      (a) =>
        DIES.includes(a.dia) &&
        APATS.includes(a.apat) &&
        cataleg.receptes.has(a.receptaId) &&
        (a.acompanyamentId === undefined || cataleg.receptes.has(a.acompanyamentId)),
    );
    if (!valids) return null;
    return { signatura: v.signatura, llavor: v.llavor, graella, apats: v.apats, avisos: Array.isArray(v.avisos) ? v.avisos : [] };
  } catch {
    return null;
  }
}

export function desarMenu(menu: MenuDesat): void {
  try {
    window.localStorage.setItem(CLAU_MENU, JSON.stringify(menu));
  } catch {
    // Sense emmagatzematge.
  }
}
