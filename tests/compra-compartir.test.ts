import { describe, expect, it } from 'vitest';
import { catalegInicial } from '../src/dades';
import { avaluarMenu, configuracioDesDeRespostes, graellaPerDefecte, planificar, respostesPerDefecte } from '../src/domini';
import { textLlista } from '../src/ui/compra';

const configuracio = configuracioDesDeRespostes(respostesPerDefecte());
const { apats } = planificar({ cataleg: catalegInicial, configuracio, graella: graellaPerDefecte(), llavor: 4 });
const { llista } = avaluarMenu(catalegInicial, configuracio, apats);
const aComprar = llista.elements.filter((e) => !e.rebost);

describe('text de la llista per compartir', () => {
  it('porta tot el que cal comprar, per seccions, i el rebost al final', () => {
    const text = textLlista(llista, new Set(), new Set(), 'Llista de la compra');
    expect(text.startsWith('🛒 Llista de la compra')).toBe(true);
    for (const e of aComprar) expect(text).toContain(`- ${e.nom}: `);
    expect(text).toMatch(/Comprova que en tens: .+\.$/);
  });

  it('treu el que ja és al carro i el que ja es té a casa', () => {
    const [a, b] = aComprar;
    const text = textLlista(llista, new Set([a!.ingredientId]), new Set([b!.ingredientId]), 'Llista');
    expect(text).not.toContain(`- ${a!.nom}: `);
    expect(text).not.toContain(`- ${b!.nom}: `);
    expect(text).toContain(`- ${aComprar[2]!.nom}: `);
  });

  it('si ja es té tot, ho diu', () => {
    const tot = new Set(aComprar.map((e) => e.ingredientId));
    expect(textLlista(llista, new Set(), tot, 'Llista')).toContain('Ja ho tenim tot!');
  });
});
