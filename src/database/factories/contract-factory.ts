import { subDays } from 'date-fns';
import { getConnection, getRepository } from 'typeorm';
import * as faker from 'faker';
import { clientes } from '../mock/clientes';
import { revenda } from '../mock/users';
import { products } from '../mock/products';

import { Contrato, Cliente } from '../entities';

export async function generateData(customData: any = {}) {
  const cliente = await getRepository(Cliente).findOne({
    codcliente:
      clientes[Math.floor(Math.random() * clientes.length)].codcliente,
  });

  return {
    dataInicio: subDays(new Date(), 10),
    campanha: 'promocional',
    versao: 'b',
    sufixo: faker.lorem.word(),
    adminEmail: faker.internet.email(),
    codproduto: products[0].codproduto,
    codrevenda: revenda.id,
    codcliente: cliente.codcliente,
    cliente,
    status: 'ativo',
    ...customData,
  };
}

export async function create(customData: any = {}) {
  const contrato = new Contrato();

  const data = await generateData(customData);

  contrato.dataInicio = data.dataInicio;
  contrato.sufixo = data.sufixo;
  contrato.codproduto = parseInt(data.codproduto, 10);
  contrato.codrevenda = parseInt(data.codrevenda, 10);
  contrato.adminEmail = data.adminEmail;
  contrato.status = data.status;

  contrato.cliente = data.cliente;
  contrato.contratosSecundarios = data.contratosSecundarios;

  await getConnection().manager.save(contrato);

  return contrato;
}
