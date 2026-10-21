import type { Recepta } from '../domini';
import { c, l, p } from './ajudants';

// Acompanyaments afegits a l'octubre de 2026: pa amb tomàquet, amanida i puré de patata.
// Quantitats per a 4 racions normals. Els primers acompanyaments són a `receptes.ts`.

export const receptesAcompanyaments: Recepta[] = [
  {
    id: 'pa-amb-tomaquet',
    nom: 'Pa amb tomàquet',
    racions: 4,
    tempsMinuts: 10,
    etiquetes: [],
    tipus: 'acompanyament',
    ingredients: [l('pa-pages', 400), l('tomaquet', 3, 'u'), l('oli-oliva', 50), l('sal', 3)],
    passos: [
      p(
        'Talla el pa ({pa-pages}) a llesques d’1,5 cm de gruix. Si el pa és d’un dia per l’altre, millor: aguanta més la polpa sense estovar-se.',
      ),
      c(
        'Torra les llesques a la torradora, o a la graella del forn amb el gratinador encès, fins que siguin daurades i cruixents per fora ' +
          'però encara toves per dins. Al forn, gira-les a la meitat del temps.',
        3,
        'Torrar el pa',
      ),
      p(
        'Renta els tomàquets ({tomaquet}) i talla’ls per la meitat de través (els més madurs o de penjar són els millors). ' +
          'Frega la cara tallada sobre cada llesca, prement, fins que el pa quedi ben vermell i a la mà només et quedi la pell.',
      ),
      p(
        'Tira-hi la sal ({sal}) per sobre i, després, l’oli ({oli-oliva}) en un fil fi, repartit per tota la llesca. ' +
          'Serveix-lo de seguida: si espera, el pa s’estova.',
      ),
    ],
  },
  {
    id: 'amanida',
    nom: 'Amanida verda',
    racions: 4,
    tempsMinuts: 15,
    etiquetes: [],
    tipus: 'acompanyament',
    ingredients: [
      l('enciam', 1),
      l('tomaquet', 2, 'u'),
      l('cogombre', 1, 'u'),
      l('ceba', 75),
      l('oli-oliva', 40),
      l('vinagre', 15),
      l('sal', 3),
    ],
    passos: [
      p(
        'Separa les fulles de l’enciam ({enciam}) i llença les de fora si estan fetes malbé. Renta-les en un bol gran amb aigua freda, ' +
          'remenant-les amb la mà, i escorre-les amb un centrifugador o eixuga-les amb un drap net. Han de quedar ben seques: si són molles, ' +
          'l’amaniment no s’hi enganxa i l’amanida queda aigualida.',
      ),
      p('Talla les fulles a trossos d’una mossegada amb les mans o amb un ganivet, i posa-les a l’enciamera.'),
      p(
        'Renta els tomàquets ({tomaquet}), treu-los el pedúncul i talla’ls a gallons. Pela el cogombre ({cogombre}) i talla’l a rodanxes fines. ' +
          'Pela la ceba ({ceba}) i talla-la a tires molt fines. Posa-ho tot a sobre de l’enciam.',
      ),
      c(
        'Si la ceba pica gaire, posa les tires en un bol amb aigua freda abans d’afegir-les a l’amanida, i escorre-les bé. ' +
          'Treu-li la força sense perdre el cruixent.',
        5,
        'Remull de la ceba',
      ),
      p(
        'Amaniment: en un got, posa la sal ({sal}) i el vinagre ({vinagre}) i remena fins que la sal es desfaci; afegeix-hi l’oli ({oli-oliva}) ' +
          'i bat-ho amb una forquilla fins que es barregi.',
      ),
      p(
        'Amaneix l’amanida just abans de menjar i remena-la amb dues culleres, de baix a dalt, perquè tot quedi amarat. ' +
          'Si l’amaneixes abans d’hora, l’enciam es pansa.',
      ),
    ],
  },
  {
    id: 'pure-patata',
    nom: 'Puré de patata',
    racions: 4,
    tempsMinuts: 35,
    etiquetes: [],
    tipus: 'acompanyament',
    ingredients: [l('patata', 1000), l('llet', 200), l('mantega', 50), l('nou-moscada', 1), l('sal', 8)],
    passos: [
      p(
        'Pela les patates ({patata}) i talla-les a trossos iguals d’uns 4 cm, perquè es coguin alhora. Posa-les en una olla amb aigua freda ' +
          'que les cobreixi dos dits i la meitat de la sal ({sal:1/2}). Començar amb aigua freda fa que es coguin igual per fora i per dins.',
      ),
      c(
        'Porta-ho a ebullició a foc fort i, quan bulli, abaixa a foc mitjà. Cou-les fins que la punta d’un ganivet les travessi sense cap resistència ' +
          'i es comencin a esmicolar per les vores.',
        20,
        'Bullir les patates',
      ),
      p(
        'Mentrestant, escalfa la llet ({llet}) en un cassó petit a foc baix fins que fumegi, sense que arribi a bullir. ' +
          'La llet freda refredaria el puré i el faria enganxós.',
      ),
      c(
        'Escorre les patates i torna-les a l’olla buida, a foc baix. Remena-les amb una cullera de fusta perquè s’evapori l’aigua que els queda: ' +
          'un puré amb patates aigualides queda llardós.',
        1,
        'Assecar les patates',
      ),
      p(
        'Aparta l’olla del foc, afegeix-hi la mantega ({mantega}) a trossets i aixafa les patates amb un passapurés o una forquilla fins que no ' +
          'quedin grumolls. No facis servir batedora elèctrica: trenca el midó i el puré queda com una goma.',
      ),
      p(
        'Afegeix la llet calenta a poc a poc, remenant amb la cullera de fusta, fins que el puré sigui cremós i caigui de la cullera sense ser líquid ' +
          '(potser no et caldrà tota). Ratlla-hi la nou moscada ({nou-moscada}), afegeix la resta de la sal ({sal:1/2}), tasta’l i serveix-lo calent.',
      ),
    ],
  },
];
