// Dados de exemplo simulando a aba "CADASTRO CLIENTES" da planilha.
// Quando a integração com Google Sheets (Service Account) for plugada,
// esse arquivo deixa de ser usado — ver src/lib/sheetsService.js
export const mockClients = [
  {
    nome: 'Agropecuária Bom Jesus Ltda',
    cnpjCpf: '12.345.678/0001-90',
    endereco: 'Av. Brasil, 1200, Centro, Lagoa Santa/MG',
    telefone: '(31) 99999-1234',
    email: 'compras@bomjesus.com.br',
  },
  {
    nome: 'Construtora Rocha & Filhos',
    cnpjCpf: '98.765.432/0001-10',
    endereco: 'Rua das Palmeiras, 45, Bairro Industrial, Vespasiano/MG',
    telefone: '(31) 98888-5678',
    email: 'financeiro@rochaefilhos.com.br',
  },
  {
    nome: 'José Carlos Andrade',
    cnpjCpf: '123.456.789-00',
    endereco: 'Rua Minas Gerais, 300, Confisco, Lagoa Santa/MG',
    telefone: '(31) 97777-4321',
    email: 'jc.andrade@gmail.com',
  },
];
