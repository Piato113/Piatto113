# Piatto113

*Menjar, quan tu vulguis.*

Planificador setmanal d'àpats per a la família. És una aplicació web instal·lable (PWA) en català.

## Què farà

- Configurar la família: persones i factor de gana de cadascuna, preferències alimentàries, aliments exclosos, temps màxim per cuinar i pressupost setmanal.
- Triar, dia a dia, si es planifica el dinar, el sopar o tots dos.
  Per defecte: només sopar de dilluns a divendres, i dinar i sopar dissabte i diumenge.
- Proposar els àpats de la setmana i mostrar-ne les receptes.
- Calcular les quantitats de cada ingredient segons les racions.
- Generar una llista de compra unificada.
- Estimar el cost amb un catàleg de preus orientatius editables.
- Desar-ho tot al compte de cada usuari (Supabase, amb inici de sessió per correu).

## Tecnologies

| Peça | Ús |
|---|---|
| Vite + TypeScript (sense framework) | Aplicació d'una sola pàgina |
| Vitest | Tests dels càlculs |
| Supabase | Inici de sessió i base de dades |
| Cloudflare Pages | Publicació |
| GitHub | Control de versions |

## Estructura

```
index.html              Única pàgina HTML
public/                 Manifest, icones i service worker
src/
  ui/                   Pantalles i components (només interfície)
  domini/               Lògica pura: unitats, escalat, planificador, llista, cost
  dades/                Catàleg inicial: ingredients, receptes, preus
  emmagatzematge/       Lectura i escriptura de dades (Supabase)
  textos/ca.ts          Tots els textos en català
tests/                  Tests de la lògica
supabase/               Fitxers SQL de l'esquema (s'executen a mà)
```

## Regles de càlcul

- **Unitats base:** `g`, `ml` i `u` (unitats). Cada ingredient en té una de fixa.
  Les quantitats es desen sempre en unitat base i en nombres enters.
- **Racions efectives:** suma dels factors de gana de les persones
  (1,0 normal; més d'1 si menja més; menys d'1 si menja menys).
- **Diners:** sempre en cèntims enters; es mostren en euros.
- **Cost de compra d'un ingredient:** paquets = ⌈quantitat necessària ÷ mida del paquet⌉,
  i cost = paquets × preu del paquet.
- **Cost consumit:** quantitat necessària × preu del paquet ÷ mida del paquet.
- **Rebost** (oli, sal, espècies…): surt a la llista, però no suma al cost de compra.
- **Conversions:** una recepta pot dir «1 u» de ceba si l'ingredient declara quants grams fa una unitat.
  Sense conversió declarada, no es converteix mai.
- **Arrodoniment:** les sumes es fan en mil·lèsimes exactes i només s'arrodoneix al final, cap amunt
  (dues receptes amb mitja ceba = 1 ceba, no 2).

## Planificador

1. **Filtra** les receptes: cap ingredient exclòs, dins del temps màxim i amb totes les etiquetes obligatòries.
2. **Tria** una recepta per a cada àpat marcat a la graella, sense repetir mentre n'hi hagi prou.
   Les receptes que ho demanen (carn arrebossada, entrecot…) porten també un acompanyament
   (arròs blanc, patates, cuscús, pa amb tomàquet, amanida, puré…); els acompanyaments no ocupen
   mai un àpat sols. Una principal pot limitar quins acompanyaments admet (les patates d'Olot,
   per exemple), i una recepta de doble ús (la truita de patates) pot fer de principal o
   d'acompanyament.
   Les etiquetes preferides fan que una recepta tingui més probabilitat de sortir.
   El sorteig fa servir una llavor: la mateixa llavor dona el mateix menú.
3. **Ajusta al pressupost:** si el cost de compra el supera, canvia la recepta més cara
   per la candidata més barata, fins que hi cap o ja no es pot abaratir més.
4. **Avisa** si no hi ha àpats marcats, si cap recepta és vàlida, si cal repetir receptes,
   si el pressupost no és possible o si falten preus.

La lògica és a `src/domini/` i no depèn de la interfície. Els tests són a `tests/`.

## Catàleg inicial

A `src/dades/`: ingredients, receptes (quantitats per a 4 racions normals), la preparació pas a pas (`preparacio.ts`)
i preus **orientatius** de referència Mercadona. Els preus s'han de revisar amb el tiquet i es podran editar a l'app.
Dins del text dels passos, `{ingredient}` es substitueix per la quantitat escalada i `{ingredient:1/2}` per una part;
els passos que ho necessiten porten un cronòmetre (durada i nom).
Els tests comproven que el catàleg no té errors, que cada ingredient surt en algun pas, que tot ingredient comprable té preu
i que es pot planificar una setmana sense repetir.

## Posar-ho en marxa en local

Cal Node.js 22 o posterior.

```bash
npm install
cp .env.example .env    # i omple-hi la URL i la clau pública de Supabase
npm run dev             # servidor local
npm test                # tests
npm run build           # compilació a dist/
```

## Seguretat

- Al fitxer `.env` i a Cloudflare només hi van la URL del projecte i la **clau pública** de Supabase.
- La clau secreta de Supabase no es fa servir mai en aquesta aplicació.
- Cada usuari només pot veure i modificar les seves dades (regles RLS de Supabase).
