import { getCardRate } from '../data/mockProducts';

const METHODS = [
  { id: 'pix', label: 'Pix (5% de desconto)' },
  { id: 'prazo', label: 'Prazo (sem alteração)' },
  { id: 'cartao', label: 'Cartão de crédito' },
];

export default function Payment({ payment, onChange }) {
  function setMethod(method) {
    onChange({ ...payment, method, parcelas: method === 'cartao' ? payment.parcelas || 1 : payment.parcelas });
  }

  const rate = payment.method === 'cartao' ? getCardRate(Number(payment.parcelas) || 1) : 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        {METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`flex-1 text-sm font-medium px-3 py-2 rounded-md border transition ${
              payment.method === m.id
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {payment.method === 'cartao' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Número de parcelas</label>
          <input
            type="number"
            min="1"
            max="12"
            value={payment.parcelas}
            onChange={(e) => onChange({ ...payment, parcelas: e.target.value })}
            className="w-full sm:w-32 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Taxa aplicada: {(rate * 100).toFixed(2)}% sobre o subtotal dos itens
          </p>
        </div>
      )}
    </div>
  );
}
