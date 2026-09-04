import { useState, useEffect, useRef } from 'react';
import { searchProducts } from '../lib/sheetsService';

export default function Items({ items, onChange }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantidade, setQuantidade] = useState('');
  const boxRef = useRef(null);

  useEffect(() => {
    let active = true;
    searchProducts(query).then((r) => {
      if (active) setResults(r);
    });
    return () => {
      active = false;
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleAdd() {
    if (!selectedProduct || !quantidade || Number(quantidade) <= 0) return;
    const qtd = Number(quantidade);
    const valorTotal = qtd * selectedProduct.valorM2;
    onChange([
      ...items,
      {
        id: crypto.randomUUID(),
        ...selectedProduct,
        quantidade: qtd,
        valorTotal,
      },
    ]);
    setSelectedProduct(null);
    setQuery('');
    setQuantidade('');
  }

  function handleRemove(id) {
    onChange(items.filter((it) => it.id !== id));
  }

  const subtotal = items.reduce((sum, it) => sum + it.valorTotal, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 relative" ref={boxRef}>
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedProduct(null);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Buscar produto por código ou descrição..."
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          {open && !selectedProduct && results.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-slate-200 rounded-md mt-1 shadow-lg max-h-56 overflow-auto">
              {results.map((p) => (
                <li
                  key={p.codigo}
                  onClick={() => {
                    setSelectedProduct(p);
                    setQuery(`${p.codigo} — ${p.especificacao}`);
                    setOpen(false);
                  }}
                  className="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer"
                >
                  <div className="font-medium">{p.codigo} — {p.especificacao}</div>
                  <div className="text-xs text-slate-500">
                    {p.dimensoes} • R$ {p.valorM2.toFixed(2)} / {p.unidade}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          type="number"
          min="0"
          step="0.01"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          placeholder="Qtd"
          className="w-full sm:w-28 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
        <button
          onClick={handleAdd}
          disabled={!selectedProduct || !quantidade}
          className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
        >
          Adicionar
        </button>
      </div>

      {items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="py-2 pr-2">Código</th>
                <th className="py-2 pr-2">Especificação</th>
                <th className="py-2 pr-2">Dimensões</th>
                <th className="py-2 pr-2 text-right">Qtd</th>
                <th className="py-2 pr-2 text-right">Vlr. unit.</th>
                <th className="py-2 pr-2 text-right">Total</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b border-slate-100">
                  <td className="py-2 pr-2">{it.codigo}</td>
                  <td className="py-2 pr-2">{it.especificacao}</td>
                  <td className="py-2 pr-2">{it.dimensoes}</td>
                  <td className="py-2 pr-2 text-right">{it.quantidade} {it.unidade}</td>
                  <td className="py-2 pr-2 text-right">R$ {it.valorM2.toFixed(2)}</td>
                  <td className="py-2 pr-2 text-right font-medium">R$ {it.valorTotal.toFixed(2)}</td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => handleRemove(it.id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right text-sm font-semibold mt-2">
            Subtotal: R$ {subtotal.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
