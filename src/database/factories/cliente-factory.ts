import { getConnection, getRepository } from 'typeorm';
import * as faker from 'faker';

import { Cliente } from '../entities';
import cnpj from './cnpj-factory';

export function genetateClienteData(customData: any = {}) {
  return {
    razaosocial: `${faker.company.companyName()} AND ${faker.company.companyName()}`,
    fantasia: 'CLIENTE TESTE',
    cnpj: cnpj(),
    endereco: faker.address.streetAddress(),
    bairro: faker.address.secondaryAddress(),
    cidade: faker.address.city(),
    uf: 'MG',
    cep: '36000000',
    tel1: '32111111',
    tel2: '32111112',
    fax: '32111113',
    email: faker.internet.email(),
    inscricaoestadual: '21321321213312312335',
    inscricaomunicipal: '21321321213312312334',
    observacao: '',
    naoRecebeAtestado: 'F',
    ...customData,
  };
}

export async function create(customData: any = {}) {
  const data = genetateClienteData(customData);

  const cliente = new Cliente();

  cliente.razaosocial = data.razaosocial;
  cliente.fantasia = data.fantasia;
  cliente.cnpj = data.cnpj;
  cliente.endereco = data.endereco;
  cliente.bairro = data.bairro;
  cliente.cidade = data.cidade;
  cliente.uf = data.uf;
  cliente.cep = data.cep;
  cliente.tel1 = data.tel1;
  cliente.tel2 = data.tel2;
  cliente.fax = data.fax;
  cliente.email = data.email;
  cliente.inscricaoestadual = data.inscricaoestadual;
  cliente.inscricaomunicipal = data.inscricaomunicipal;
  cliente.observacao = data.observacao;
  cliente.naoRecebeAtestado = data.naoRecebeAtestado;

  await getConnection().manager.save(cliente);

  return cliente;
}

export async function truncateClientes() {
  return getRepository(Cliente).delete({ fantasia: 'CLIENTE TESTE' });
}
