import type { Cuina, Recepta } from '../domini';

// Cuina de cada recepta, per filtrar el receptari. Les que no hi surten són «casolana»
// (plats de cada dia sense una cuina concreta: a la planxa, al forn, amanides, cremes…).
// Un test comprova que tots els identificadors existeixen.

const llista = (cuina: Cuina, ids: string[]): [string, Cuina][] => ids.map((id) => [id, cuina]);

export const cuinesReceptes: Record<string, Cuina> = Object.fromEntries([
  ...llista('catalana', [
    'canelons', 'fideus-cassola', 'trinxat', 'pollastre-samfaina', 'botifarra-mongetes', 'fricando', 'escalivada-tonyina',
    'bacalla-samfaina', 'mandonguilles-sipia', 'mongetes-botifarra-esparracada', 'arros-cassola-costella', 'arros-negre',
    'pollastre-prunes-pinyons', 'patates-olot', 'escudella', 'sopa-galets', 'truita-botifarra-ou', 'mandonguilles-tomaquet',
    'suquet-peix', 'mar-i-muntanya', 'esqueixada', 'espinacs-catalana', 'conill-cassola', 'faves-catalana', 'coca-recapte',
    'arros-caldos-marisc', 'bacalla-llauna', 'pebrots-farcits', 'botifarra-bolets', 'empedrat', 'arros-conill-carxofes',
    'costelles-xai-allioli', 'canelons-espinacs', 'farcellets-col', 'botifarra-ceba-patates', 'escudella-barrejada',
    'samfaina-ou', 'bledes-patates', 'sopa-farigola', 'mongetes-saltejades-cansalada', 'arros-col-mongetes',
    'pollastre-encebat', 'salsitxes-encebades', 'pa-amb-tomaquet', 'pa-tomaquet-pernil-formatge',
    'botifarra-brasa-mongetes', 'calcotada', 'escalivada-brasa', 'allioli', 'romesco',
  ]),
  ...llista('espanyola', [
    'pinxos-morunos', 'mojo-pico', 'mojo-verd',
    'paella', 'fideua', 'arros-cubana', 'llenties-estofades', 'truita-patates', 'cocido-cordoves', 'estofat-patates-xorico',
    'cigrons-espinacs', 'cigrons-xorico', 'mongetes-verdures-pernil', 'bacalla-tomaquet', 'ous-plat',
    'pop-gallega', 'caldo-gallec', 'empanada-tonyina', 'lluc-gallega', 'raxo-patates', 'musclos-marinera', 'marmitako',
    'bacalla-biscaina', 'lluc-salsa-verda', 'porrusalda', 'piperrada-ou', 'mongetes-tolosa', 'truita-bacalla',
    'calamars-tinta', 'pollastre-txilindron', 'salmorejo', 'flamenquins', 'calamars-andalusa', 'carn-tomaquet',
    'pollastre-ajillo', 'patates-pobre-ou', 'seitons-fregits', 'pipirrana', 'sopa-picadillo', 'patates-sipia',
    'gazpachuelo', 'gaspatxo', 'fabada', 'cocido-madrileny', 'pisto-ou', 'ous-trencats-pernil', 'sopa-castellana',
    'croquetes-pernil', 'ensaladilla-russa', 'pollastre-pepitoria', 'arros-forn', 'potatge-cigrons-carbassa',
    'paella-verdures', 'fideua-verdures', 'patates-guisades-costella', 'migas', 'patates-revolcones', 'coliflor-ajada',
    'pescadilla-romana', 'arros-musclos', 'fideus-caldosos-musclos', 'pollastre-jardinera', 'cigrons-fregits-ou',
    'ous-tomaquet', 'patates-carn-picada',
  ]),
  ...llista('italiana', [
    'macarrons-bolonyesa', 'tallarins-carbonara', 'risotto-bolets', 'lasanya', 'pizza', 'penne-pesto-pollastre',
    'macarrons-tonyina', 'rigatoni-salsitxes', 'risotto-pollastre', 'gnocchi-formatges', 'raviolis-tomaquet',
    'tortellini-nata', 'parmigiana', 'pollastre-parmesana', 'focaccia', 'pasta-forn', 'puttanesca', 'calzone',
    'piadines-pernil', 'bolonyesa-soja', 'espaguetis-all-tomaquet-sec', 'penne-arrabbiata', 'lasanya-verdures',
    'pizza-verdures', 'espaguetis-cacio-pepe', 'risotto-carbassa', 'macarrons-formatge', 'pizza-tonyina-ceba',
    'macarrons-tomaquet-formatge', 'espaguetis-carbasso', 'pasta-cigrons', 'espaguetis-alberginia', 'pasta-coliflor',
    'macarrons-carbassa-cansalada',
  ]),
  ...llista('mexicana', [
    'tacos-pastor-brasa', 'fajitas-brasa', 'guacamole', 'pico-de-gallo',
    'quesadilles-pollastre', 'fajitas-pollastre', 'tacos-carn-picada', 'nachos-forn', 'chili-sense-carn', 'fajitas-verdures',
    'wraps-pollastre',
  ]),
  ...llista('asiatica', ['pollastre-teriyaki-brasa', 'salsa-teriyaki', 'arros-saltejat-ou', 'saltejat-porc-soja', 'noodles-pollastre', 'wok-noodles-anacards', 'curri-cigrons']),
  ...llista('mon', [
    'kofta-brasa', 'chimichurri', 'provoleta-verdures',
    'falafel', 'llenties-arros-ceba', 'cuscus', 'cuscus-pollastre-verdures', 'bol-quinoa', 'coliflor-rostida-cigrons',
    'quiche-porros', 'creps-salades', 'creps-espinacs-formatge', 'sopa-ceba', 'pastis-carn', 'hamburgueses',
    'hamburgueses-formatge', 'hamburgueses-cigrons',
  ]),
]);

/** Afegeix la cuina a una recepta (per defecte, «casolana»). */
export function ambCuina(r: Recepta): Recepta {
  return { ...r, cuina: cuinesReceptes[r.id] ?? 'casolana' };
}
