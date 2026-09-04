// Camada de acesso a dados. Hoje lê dos mocks em src/data/.
// Quando for plugar a planilha real, troque só as funções abaixo pelo
// mesmo padrão do projeto de nota fiscal (Service Account + rota de API
// que faz a leitura da planilha e devolve JSON — o Vite não fala direto
// com a Sheets API no browser por causa da credencial).
//
// Sugestão de rota: GET /api/clientes?nome=xxx  -> aba CADASTRO CLIENTES
//                    GET /api/produtos?q=xxx     -> abas de categoria unificadas
//                    GET /api/juros-cartao       -> aba Juros Cartão

import { mockClients } from '../data/mockClients';
import { mockProducts, cardInterestTable } from '../data/mockProducts';

const SIMULATED_DELAY = 150;

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_DELAY));
}

export async function searchClients(query) {
  if (!query || query.trim().length < 2) return delay([]);
  const q = query.toLowerCase();
  return delay(mockClients.filter((c) => c.nome.toLowerCase().includes(q)));
}

export async function searchProducts(query) {
  if (!query || query.trim().length < 1) return delay(mockProducts.slice(0, 8));
  const q = query.toLowerCase();
  return delay(
    mockProducts.filter(
      (p) =>
        p.codigo.toLowerCase().includes(q) ||
        p.especificacao.toLowerCase().includes(q)
    )
  );
}

export async function getCardInterestTable() {
  return delay(cardInterestTable);
}
