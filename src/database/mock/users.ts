const revenda = {
  id: '270',
  name: 'INSPELL TECNOLOGIA E SERVICOS LTDA',
  type: 'revenda',
  p: ['*'],
};

const revenda2 = {
  id: '437',
  name: 'Desenvolvimento Testes',
  type: 'revenda',
  p: ['*'],
};

const tecnicoRevendaSemPermissaoContrato = {
  id: '387',
  codtecnico: '25',
  name: 'dani teste',
  type: 'tecnicoRevenda',
  p: [],
};

const revenda3 = {
  id: '1246',
  name: 'Teste Suporte Inspell 03',
  type: 'revenda',
  p: ['*'],
};

const tecnicoRevenda = {
  id: '387',
  codtecnico: '9',
  name: 'FÃ¡bio Rocha',
  type: 'tecnicoRevenda',
  p: ['*', 'podeConsultarMeusClientes', 'podeLicenciarClientes'],
};

const tecnicoRevendaInativo = {
  id: '387',
  codtecnico: '15',
  name: 'Rock Morais',
  type: 'tecnicoRevenda',
  p: ['*', 'podeConsultarMeusClientes', 'podeLicenciarClientes'],
};

const atendenteInativo = {
  id: '1',
  name: 'JosÃ© Augusto',
  type: 'atendente',
  p: ['*'],
};

const atendente = {
  id: '2',
  name: 'Davidson Campos',
  type: 'atendente',
  p: ['*'],
};

export {
  revenda,
  revenda2,
  revenda3,
  tecnicoRevendaInativo,
  atendenteInativo,
  tecnicoRevendaSemPermissaoContrato,
  tecnicoRevenda,
  atendente,
};
