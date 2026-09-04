import { useState } from 'react';
import Header from './components/Header';
import ClientSearch from './components/ClientSearch';
import Conditions from './components/Conditions';
import Freight from './components/Freight';
import Items from './components/Items';
import Payment from './components/Payment';
import Total from './components/Total';
import { calculateTotal } from './lib/calculations';
import { generateOrcamentoPdf, downloadPdf } from './lib/pdfGenerator';

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 mb-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-4">{title}</h2>
      {children}
    </div>
  );
}

export default function App() {
  const [client, setClient] = useState(null);
  const [conditions, setConditions] = useState({
    vendedor: '',
    comprador: '',
    prazoPagamento: '',
    prazoEntrega: '',
    validade: '',
  });
  const [freight, setFreight] = useState({ valor: '', endereco: '' });
  const [items, setItems] = useState([]);
  const [payment, setPayment] = useState({ method: 'prazo', parcelas: 1 });
  const [generating, setGenerating] = useState(false);

  const result = calculateTotal({ items, freightValue: freight.valor, payment });

  async function handleGeneratePdf() {
    setGenerating(true);
    try {
      const bytes = await generateOrcamentoPdf({
        client,
        conditions,
        freight,
        items,
        paymentResult: result,
        paymentMethod: payment.method,
      });
      const fileName = `orcamento_${(client?.nome || 'cliente').replace(/\s+/g, '_')}.pdf`;
      downloadPdf(bytes, fileName);
    } finally {
      setGenerating(false);
    }
  }

  const canGenerate = client && items.length > 0;

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Header />

        <Section title="Cliente">
          <ClientSearch client={client} onSelectClient={setClient} />
        </Section>

        <Section title="Condições">
          <Conditions conditions={conditions} onChange={setConditions} />
        </Section>

        <Section title="Frete">
          <Freight freight={freight} onChange={setFreight} />
        </Section>

        <Section title="Itens">
          <Items items={items} onChange={setItems} />
        </Section>

        <Section title="Pagamento">
          <Payment payment={payment} onChange={setPayment} />
        </Section>

        <div className="mb-5">
          <Total result={result} paymentMethod={payment.method} />
        </div>

        <button
          onClick={handleGeneratePdf}
          disabled={!canGenerate || generating}
          className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          {generating ? 'Gerando PDF...' : 'Gerar PDF do orçamento'}
        </button>
        {!canGenerate && (
          <p className="text-xs text-slate-500 text-center mt-2">
            Selecione um cliente e adicione ao menos um item para gerar o PDF.
          </p>
        )}
      </div>
    </div>
  );
}
