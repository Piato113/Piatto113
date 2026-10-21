import './estils.css';
import { textos } from './textos/ca';

const arrel = document.querySelector<HTMLDivElement>('#app');

if (!arrel) {
  throw new Error("No s'ha trobat l'element #app");
}

arrel.innerHTML = `
  <main class="pagina">
    <h1>${textos.app.nom}</h1>
    <p>${textos.app.enConstruccio}</p>
  </main>
`;
