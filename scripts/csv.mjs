// Lector de CSV amb cometes (els noms de producte poden portar comes). El fan servir els scripts del Mercadona.

/** CSV amb cometes (els noms poden portar comes). */
export function llegirCsv(text) {
  const files = [];
  let fila = [];
  let camp = '';
  let entreCometes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (entreCometes) {
      if (c === '"' && text[i + 1] === '"') {
        camp += '"';
        i++;
      } else if (c === '"') entreCometes = false;
      else camp += c;
    } else if (c === '"') entreCometes = true;
    else if (c === ',') {
      fila.push(camp);
      camp = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      fila.push(camp);
      if (fila.some((x) => x !== '')) files.push(fila);
      fila = [];
      camp = '';
    } else camp += c;
  }
  if (camp !== '' || fila.length > 0) files.push([...fila, camp]);
  const [capcalera, ...dades] = files;
  return dades.map((f) => Object.fromEntries(capcalera.map((c, i) => [c, f[i] ?? ''])));
}
