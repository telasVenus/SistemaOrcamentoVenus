import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { company, pickupAddress } from '../data/company';

export async function generateOrcamentoPdf({ client, conditions, freight, items, paymentResult, paymentMethod }) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const margin = 40;
  let y = 800;
  const lineHeight = 16;

  const drawText = (text, { x = margin, size = 10, font = fontRegular, color = rgb(0, 0, 0) } = {}) => {
    page.drawText(text, { x, y, size, font, color });
  };

  const nextLine = (h = lineHeight) => {
    y -= h;
  };

  // Cabeçalho
  drawText(company.nomeFantasia, { size: 16, font: fontBold });
  nextLine(20);
  drawText(company.razaoSocial, { size: 9 });
  nextLine(12);
  drawText(company.endereco, { size: 9 });
  nextLine(12);
  drawText(`CNPJ: ${company.cnpj}  •  Tel: ${company.telefone}`, { size: 9 });
  nextLine(24);

  page.drawLine({
    start: { x: margin, y: y + 8 },
    end: { x: 595.28 - margin, y: y + 8 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  nextLine(10);

  drawText('ORÇAMENTO', { size: 14, font: fontBold });
  nextLine(24);

  // Cliente
  drawText('Cliente', { size: 11, font: fontBold });
  nextLine(16);
  drawText(client?.nome || '-', { size: 10 });
  nextLine(14);
  drawText(`CNPJ/CPF: ${client?.cnpjCpf || '-'}`, { size: 9 });
  nextLine(13);
  drawText(`Endereço: ${client?.endereco || '-'}`, { size: 9 });
  nextLine(13);
  drawText(`Telefone: ${client?.telefone || '-'}  •  E-mail: ${client?.email || '-'}`, { size: 9 });
  nextLine(20);

  // Condições
  drawText('Condições', { size: 11, font: fontBold });
  nextLine(16);
  drawText(`Vendedor: ${conditions.vendedor || '-'}    Comprador: ${conditions.comprador || '-'}`, { size: 9 });
  nextLine(13);
  drawText(
    `Prazo de pagamento: ${conditions.prazoPagamento || '-'}    Prazo de entrega: ${conditions.prazoEntrega || '-'}`,
    { size: 9 }
  );
  nextLine(13);
  drawText(`Validade da proposta: ${conditions.validade || '-'}`, { size: 9 });
  nextLine(20);

  // Frete
  const hasFreight = Number(freight.valor) > 0;
  drawText('Frete / Entrega', { size: 11, font: fontBold });
  nextLine(16);
  drawText(
    hasFreight
      ? `Endereço de entrega: ${freight.endereco || '-'}  (R$ ${Number(freight.valor).toFixed(2)})`
      : `Retirada na fábrica: ${pickupAddress}`,
    { size: 9 }
  );
  nextLine(24);

  // Itens - cabeçalho da tabela
  drawText('Itens', { size: 11, font: fontBold });
  nextLine(16);

  const cols = [
    { label: 'Código', x: margin, w: 55 },
    { label: 'Especificação', x: margin + 55, w: 170 },
    { label: 'Dimensões', x: margin + 225, w: 110 },
    { label: 'Qtd', x: margin + 335, w: 45 },
    { label: 'Vlr. unit.', x: margin + 380, w: 65 },
    { label: 'Total', x: margin + 445, w: 65 },
  ];

  cols.forEach((c) => drawText(c.label, { x: c.x, size: 8, font: fontBold }));
  nextLine(12);
  page.drawLine({
    start: { x: margin, y: y + 8 },
    end: { x: 595.28 - margin, y: y + 8 },
    thickness: 0.5,
    color: rgb(0.85, 0.85, 0.85),
  });
  nextLine(6);

  items.forEach((it) => {
    if (y < 120) return; // MVP: sem paginação; itens além disso são cortados
    drawText(it.codigo, { x: cols[0].x, size: 8 });
    drawText(truncate(it.especificacao, 32), { x: cols[1].x, size: 8 });
    drawText(it.dimensoes, { x: cols[2].x, size: 8 });
    drawText(`${it.quantidade} ${it.unidade}`, { x: cols[3].x, size: 8 });
    drawText(`R$ ${it.valorM2.toFixed(2)}`, { x: cols[4].x, size: 8 });
    drawText(`R$ ${it.valorTotal.toFixed(2)}`, { x: cols[5].x, size: 8 });
    nextLine(14);
  });

  nextLine(10);
  page.drawLine({
    start: { x: margin, y: y + 8 },
    end: { x: 595.28 - margin, y: y + 8 },
    thickness: 0.5,
    color: rgb(0.85, 0.85, 0.85),
  });
  nextLine(6);

  // Pagamento e total
  const methodLabel = { pix: 'Pix', prazo: 'Prazo', cartao: 'Cartão de crédito' }[paymentMethod] || '-';
  drawText(`Forma de pagamento: ${methodLabel}`, { size: 9, font: fontBold });
  nextLine(16);
  drawText(`Subtotal: R$ ${paymentResult.subtotal.toFixed(2)}`, { size: 9 });
  nextLine(13);
  if (paymentResult.ajuste !== 0) {
    drawText(
      `${paymentResult.ajuste < 0 ? 'Desconto' : 'Acréscimo'} (${Math.abs(paymentResult.percentual * 100).toFixed(2)}%): R$ ${Math.abs(paymentResult.ajuste).toFixed(2)}`,
      { size: 9 }
    );
    nextLine(13);
  }
  if (paymentResult.frete > 0) {
    drawText(`Frete: R$ ${paymentResult.frete.toFixed(2)}`, { size: 9 });
    nextLine(13);
  }
  nextLine(4);
  drawText(`TOTAL: R$ ${paymentResult.total.toFixed(2)}`, { size: 13, font: fontBold });

  const bytes = await doc.save();
  return bytes;
}

function truncate(str, max) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}

export function downloadPdf(bytes, filename = 'orcamento.pdf') {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
