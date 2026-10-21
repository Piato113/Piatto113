import { ALERGENS, llegirRespostes, type RespostesQuestionari } from '../domini';

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
