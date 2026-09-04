import { pickupAddress } from '../data/company';

export default function Freight({ freight, onChange }) {
  const hasValue = Number(freight.valor) > 0;

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Valor do frete (R$)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={freight.valor}
          onChange={(e) => onChange({ ...freight, valor: e.target.value })}
          placeholder="0,00 = retirada na fábrica"
          className="w-full sm:w-56 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
      </div>

      {hasValue ? (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Endereço de entrega
          </label>
          <textarea
            value={freight.endereco}
            onChange={(e) => onChange({ ...freight, endereco: e.target.value })}
            placeholder="Cole aqui o endereço enviado pelo cliente"
            rows={3}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
      ) : (
        <div className="text-sm bg-slate-50 border border-slate-200 rounded-md p-3">
          <span className="text-slate-500">Retirada na fábrica:</span> {pickupAddress}
        </div>
      )}
    </div>
  );
}
