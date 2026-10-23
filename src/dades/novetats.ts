import type { Novetat } from '../domini';

// Novetats de l'app, de la més nova a la més vella. Surten al rètol de dalt del menú durant uns dies
// i a la llista que s'obre en tocar-lo.
// Quan un push porti alguna cosa nova per a qui fa servir l'app, s'afegeix una línia al principi.
// Text curt (es llegeix mentre passa): sense punt final.

export const NOVETATS: readonly Novetat[] = [
  { data: '2026-10-23', text: 'Menú més endreçat: el plat d’avui a dalt i els ajustos a «⚙ Ajusta»' },
  { data: '2026-10-22', text: 'Aquest rètol, amb les xifres i les novetats de l’app' },
  { data: '2026-10-22', text: '28 receptes d’hivern: cremes, plats de cullera, galtes al vi negre, xai al txilindron…' },
  { data: '2026-10-22', text: 'Els plats de temporada surten més sovint' },
  { data: '2026-10-22', text: 'L’app ara es diu A Taula' },
  { data: '2026-10-22', text: 'Asado argentí: vacío, entranya, choripán, matambre a la pizza… i el filtre «Argentina»' },
  { data: '2026-10-22', text: 'Valoreu els plats que ja heu menjat: els 👍 surten més i els 👎 deixen de sortir' },
  { data: '2026-10-22', text: 'Els àpats que ja han passat no canvien en tornar a fer el menú' },
  { data: '2026-10-22', text: 'L’app funciona sense connexió' },
  { data: '2026-10-22', text: '«Ja ho tinc» i «Comparteix la llista» a la compra' },
  { data: '2026-10-22', text: 'Fixeu un plat 📌 perquè no canviï en fer un altre menú' },
  { data: '2026-10-22', text: 'Barbacoa: 46 receptes de brasa i un receptari de salses' },
  { data: '2026-10-22', text: '11 receptes de cuina ràpida de casa, i les hamburgueses d’en Roger' },
  { data: '2026-10-22', text: 'Receptari complet, amb filtres per cuines i la llista de la compra de cada plat' },
  { data: '2026-10-22', text: '50 receptes econòmiques' },
  { data: '2026-10-21', text: 'Menú d’un mes sencer, amb calendari i la compra del mes' },
  { data: '2026-10-21', text: '30 receptes vegetarianes i veganes' },
  { data: '2026-10-21', text: '50 receptes tradicionals de Catalunya i d’arreu de l’Estat' },
  { data: '2026-10-21', text: 'Què teniu a la cuina? Els plats s’adapten als vostres aparells' },
  { data: '2026-10-21', text: 'Qui hi ha a taula: convidats i absències a cada àpat' },
];
