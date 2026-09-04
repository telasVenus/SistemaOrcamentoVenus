export default function Conditions({ conditions, onChange }) {
  function set(field, value) {
    onChange({ ...conditions, [field]: value });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Vendedor" value={conditions.vendedor} onChange={(v) => set('vendedor', v)} />
      <Field label="Comprador" value={conditions.comprador} onChange={(v) => set('comprador', v)} />
      <Field
        label="Prazo de pagamento"
        value={conditions.prazoPagamento}
        onChange={(v) => set('prazoPagamento', v)}
        placeholder="ex: 30 dias"
      />
      <Field
        label="Prazo de entrega"
        value={conditions.prazoEntrega}
        onChange={(v) => set('prazoEntrega', v)}
        placeholder="ex: 5 dias úteis"
      />
      <Field
        label="Validade da proposta"
        value={conditions.validade}
        onChange={(v) => set('validade', v)}
        placeholder="ex: 7 dias"
      />
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
      />
    </div>
  );
}
