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
