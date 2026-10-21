import './estils.css';
import { textos } from './textos/ca';

const arrel = document.querySelector<HTMLDivElement>('#app');

if (!arrel) {
  throw new Error("No s'ha trobat l'element #app");
}

const { nomParts, lema, enConstruccio } = textos.app;

arrel.innerHTML = `
  <main class="benvinguda">
    <img class="benvinguda__icona" src="/icons/icona-512.png" alt="" width="160" height="160" />
    <h1 class="marca">
      <span class="marca__paraula">${nomParts.paraula}</span><span class="marca__numero">${nomParts.numero}</span>
    </h1>
    <p class="benvinguda__lema">${lema}</p>
    <p class="benvinguda__estat">${enConstruccio}</p>
  </main>
`;
