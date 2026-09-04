export default function Total({ result, paymentMethod }) {
  const { subtotal, ajuste, percentual, frete, total } = result;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1 text-sm">
      <Row label="Subtotal itens" value={subtotal} />
      {paymentMethod === 'pix' && (
        <Row label={`Desconto Pix (${(percentual * 100).toFixed(0)}%)`} value={ajuste} negative />
      )}
      {paymentMethod === 'cartao' && (
        <Row label={`Acréscimo cartão (${(percentual * 100).toFixed(2)}%)`} value={ajuste} />
      )}
      {frete > 0 && <Row label="Frete" value={frete} />}
      <div className="border-t border-slate-300 my-2" />
      <Row label="Total" value={total} bold />
    </div>
  );
}

function Row({ label, value, bold, negative }) {
  return (
    <div className={`flex justify-between ${bold ? 'text-base font-bold' : ''}`}>
      <span className={bold ? '' : 'text-slate-600'}>{label}</span>
      <span className={negative && value !== 0 ? 'text-emerald-600' : ''}>
        {value < 0 ? '- ' : ''}R$ {Math.abs(value).toFixed(2)}
      </span>
    </div>
  );
}
