# Supabase

Fitxers SQL de la base de dades. No es connecten sols: s'executen a mà a l'**SQL Editor** de Supabase, en aquest ordre.

| Fitxer | Què fa | Quan |
|---|---|---|
| `001_esquema.sql` | Crea les taules `dades_usuari` i `productes` i les regles de seguretat (RLS) | Una vegada; es pot repetir sense perdre dades |
| `002_productes.sql` | Carrega els productes i preus del Mercadona (generat, no s'edita a mà) | Després de l'esquema i cada vegada que hi hagi un llistat nou |
| `003_valoracions.sql` | Afegeix la columna `valoracions` (plats amb 👍 / 👎) a `dades_usuari` | Una vegada; es pot repetir sense perdre dades |
| `004_estadistiques.sql` | Comptador de menús fets i funcions per mostrar al rètol quants usuaris i menús hi ha (només números) | Una vegada; es pot repetir sense perdre dades |
| `comprovacions.sql` | Comprova que tot és al seu lloc; no canvia res | Després dels altres dos |

## Com s'executa un fitxer

1. Obre el projecte a supabase.com → **SQL Editor** (menú de l'esquerra) → **New query**.
2. Obre el fitxer a GitHub, botó **Copy raw file**, i enganxa'l a l'editor.
3. **Run**. Ha de dir *Success. No rows returned* (o mostrar la taula de comprovacions, totes amb `true`).

## Taules

- **`dades_usuari`**: una fila per usuari amb el que ara es desa al mòbil: `respostes` del qüestionari, `graella`,
  `menu`, `compra` (productes marcats i «ja ho tinc») i `valoracions` (plats amb 👍 / 👎, des de `003_valoracions.sql`). Són JSON amb el mateix format que fa servir l'app.
  Cada usuari només veu, crea, canvia i esborra la seva fila; sense sessió, res. Si s'esborra l'usuari, s'esborren les seves dades.
- **`productes`**: llistat del Mercadona (Girona, 17003), diners en cèntims. Tothom el pot llegir; només es canvia des de l'SQL Editor.

- **`comptadors`** (des de `004_estadistiques.sql`): nombre de menús fets de tota l'app. Ningú hi accedeix directament:
  l'app crida `sumar_menu()` en fer un menú i `estadistiques_app()` per llegir usuaris i menús (totes dues amb sessió iniciada).
  Si un usuari cridés `sumar_menu()` moltes vegades seguides, inflaria la xifra; no toca cap dada de ningú.

Els cronòmetres de cuina no es desen a Supabase: són d'aquell mòbil.

## Llistat de preus nou

1. Roger passa l'Excel; Claude el filtra a `dades/mercadona/productes-17003.csv`.
2. `npm run preus` (preus de l'app) i `npm run productes-sql` (genera `002_productes.sql`).
3. `npm test`, commit i push.
4. Roger executa `002_productes.sql` a l'SQL Editor: afegeix els productes nous, actualitza els preus i esborra els que ja no hi són.
