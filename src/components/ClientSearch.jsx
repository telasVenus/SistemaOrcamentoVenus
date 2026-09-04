import { useState, useEffect, useRef } from 'react';
import { searchClients } from '../lib/sheetsService';

export default function ClientSearch({ client, onSelectClient }) {
  const [query, setQuery] = useState(client?.nome || '');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (client) return; // já selecionado, não busca de novo
    let active = true;
    searchClients(query).then((r) => {
      if (active) setResults(r);
    });
    return () => {
      active = false;
    };
  }, [query, client]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(c) {
    onSelectClient(c);
    setQuery(c.nome);
    setOpen(false);
  }

  function handleChange(value) {
    setQuery(value);
    setOpen(true);
    if (client) onSelectClient(null); // desfaz seleção se o usuário editar
  }

  return (
    <div className="relative" ref={boxRef}>
      <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder="Digite o nome do cliente..."
        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
      />
      {open && !client && results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-slate-200 rounded-md mt-1 shadow-lg max-h-56 overflow-auto">
          {results.map((c) => (
            <li
              key={c.cnpjCpf}
              onClick={() => handleSelect(c)}
              className="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer"
            >
              <div className="font-medium">{c.nome}</div>
              <div className="text-xs text-slate-500">{c.cnpjCpf}</div>
            </li>
          ))}
        </ul>
      )}

      {client && (
        <div className="mt-2 text-sm bg-slate-50 border border-slate-200 rounded-md p-3 grid grid-cols-1 sm:grid-cols-2 gap-1">
          <div><span className="text-slate-500">CNPJ/CPF:</span> {client.cnpjCpf}</div>
          <div><span className="text-slate-500">Telefone:</span> {client.telefone}</div>
          <div className="sm:col-span-2"><span className="text-slate-500">Endereço:</span> {client.endereco}</div>
          <div className="sm:col-span-2"><span className="text-slate-500">E-mail:</span> {client.email}</div>
        </div>
      )}
    </div>
  );
}
