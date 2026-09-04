import { getCardRate } from '../data/mockProducts';

// Regra assumida: o desconto Pix / acréscimo do cartão incide sobre o
// subtotal dos itens; o frete entra por fora, sem desconto/acréscimo.
// Ajuste aqui se a regra real for diferente.
export function calculateTotal({ items, freightValue, payment }) {
  const subtotal = items.reduce((sum, it) => sum + it.valorTotal, 0);
  const frete = Number(freightValue) || 0;

  let ajuste = 0;
  let percentual = 0;

  if (payment.method === 'pix') {
    percentual = -0.05;
    ajuste = subtotal * percentual;
  } else if (payment.method === 'cartao') {
    percentual = getCardRate(Number(payment.parcelas) || 1);
    ajuste = subtotal * percentual;
  }

  const total = subtotal + ajuste + frete;

  return { subtotal, ajuste, percentual, frete, total };
}
