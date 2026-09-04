import { company } from '../data/company';

export default function Header() {
  return (
    <div className="bg-slate-900 text-white rounded-lg p-5 mb-6 flex flex-col gap-1">
      <h1 className="text-xl font-bold tracking-wide">{company.nomeFantasia}</h1>
      <p className="text-sm text-slate-300">{company.razaoSocial}</p>
      <p className="text-sm text-slate-300">{company.endereco}</p>
      <p className="text-sm text-slate-300">
        CNPJ: {company.cnpj} &nbsp;•&nbsp; Tel: {company.telefone}
      </p>
    </div>
  );
}
