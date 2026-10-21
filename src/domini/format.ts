import type { Unitat } from './tipus';

// Format en català: coma decimal, punt de milers.

function ambMilers(enter: number): string {
  return String(enter).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** Nombre amb com a molt `decimals` decimals, sense zeros sobrers. */
export function formatNombre(valor: number, decimals = 2): string {
  const signe = valor < 0 ? '-' : '';
  const factor = 10 ** decimals;
  const arrodonit = Math.round(Math.abs(valor) * factor);
  const enter = Math.floor(arrodonit / factor);
  const fraccio = String(arrodonit % factor).padStart(decimals, '0').replace(/0+$/, '');
  return signe + ambMilers(enter) + (fraccio ? ',' + fraccio : '');
}

/** Cèntims → «1.234,50 €». */
export function formatEuros(centims: number): string {
  const signe = centims < 0 ? '-' : '';
  const abs = Math.abs(Math.round(centims));
  const euros = Math.floor(abs / 100);
  const resta = String(abs % 100).padStart(2, '0');
  return `${signe}${ambMilers(euros)},${resta} €`;
}

/** Quantitat en unitat base → «250 g», «1,25 kg», «1,5 l», «1½ u». */
export function formatQuantitat(quantitat: number, unitat: Unitat): string {
  switch (unitat) {
    case 'g':
      return quantitat >= 1000 ? `${formatNombre(quantitat / 1000)} kg` : `${formatNombre(quantitat)} g`;
    case 'ml':
      return quantitat >= 1000 ? `${formatNombre(quantitat / 1000)} l` : `${formatNombre(quantitat)} ml`;
    case 'u': {
      const enter = Math.floor(quantitat);
      const mig = quantitat - enter >= 0.5;
      if (enter === 0 && mig) return '½ u';
      return `${ambMilers(enter)}${mig ? '½' : ''} u`;
    }
  }
}
