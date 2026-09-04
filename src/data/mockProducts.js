// Dados de exemplo simulando o catálogo unificado de produtos
// (hoje espalhado nas abas TELAS PENEIRAS, AGROPECUARIA, ONDULADA, ALAMBRADO, ARAMES).
// Ver src/lib/sheetsService.js para o ponto de integração real.
export const mockProducts = [
  {
    codigo: 'TP-001',
    especificacao: 'Tela Peneira Malha 10mm',
    dimensoes: '1,00 x 2,00 m',
    unidade: 'm²',
    valorM2: 45.9,
  },
  {
    codigo: 'AG-014',
    especificacao: 'Tela Agropecuária Ovinos/Caprinos',
    dimensoes: '1,20 x 50 m (rolo)',
    unidade: 'm²',
    valorM2: 12.5,
  },
  {
    codigo: 'ON-007',
    especificacao: 'Tela Ondulada Fio 12',
    dimensoes: '2,00 x 25 m (rolo)',
    unidade: 'm²',
    valorM2: 18.3,
  },
  {
    codigo: 'AL-022',
    especificacao: 'Tela Alambrado Fio 14 Galvanizado',
    dimensoes: '2,00 x 25 m (rolo)',
    unidade: 'm²',
    valorM2: 22.7,
  },
  {
    codigo: 'AR-005',
    especificacao: 'Arame Farpado Galvanizado',
    dimensoes: 'Rolo 500m',
    unidade: 'rolo',
    valorM2: 189.9,
  },
];

// Tabela "Juros Cartão"
export const cardInterestTable = [
  { minParcelas: 1, maxParcelas: 1, taxa: 0.028 },
  { minParcelas: 2, maxParcelas: 6, taxa: 0.03 },
  { minParcelas: 7, maxParcelas: 12, taxa: 0.032 },
];

export function getCardRate(parcelas) {
  const faixa = cardInterestTable.find(
    (f) => parcelas >= f.minParcelas && parcelas <= f.maxParcelas
  );
  return faixa ? faixa.taxa : 0;
}
