import * as faker from 'faker';
import {
  Forbidden as ForbiddenError,
  NotFound as NotFoundError,
  BadRequest as BadRequestError,
} from 'http-errors';

import { Contract as Factory } from '../../../database/factories';

import createContract from '../store-contrato';
import { suporteDb } from '../../../database/db';
import { truncate } from '../../../database/lib';
import { getRandomProduto } from '../../../database/mock/products';
import { getRandomCliente } from '../../../database/mock/clientes';
import {
  revenda,
  tecnicoRevendaSemPermissaoContrato,
} from '../../../database/mock/users';
import getIdentity from '../../../lib/get-identity';
import VersionType from '../../../lib/types/VersionType';
import CampaignType from '../../../lib/types/CampaignType';

beforeEach(async () => {
  await truncate();
});

beforeAll(async () => {
  await suporteDb.connect();
});

afterAll(async () => {
  await suporteDb.close();
});

describe('TESTE UNITÁRIO - Criar contrato', () => {
  it('Deve criar o contrato', async () => {
    const requester: any = { ...revenda };
    requester.identity = await getIdentity(revenda);

    const data = {
      dataInicio: new Date(),
      sufixo: faker.random.word(),
      adminEmail: faker.internet.email(),
      codcliente: getRandomCliente().codcliente,
      codproduto: getRandomProduto().codproduto,
      versao: 'a' as VersionType,
      campanha: 'promocional' as CampaignType,
    };

    const contract = await createContract(data, requester);

    expect(contract).toEqual({
      id: expect.any(Number),
      dataInicio: expect.any(String),
      adminEmail: data.adminEmail,
      sufixo: data.sufixo,
      status: 'ativo',
      cliente: expect.objectContaining({
        codcliente: data.codcliente,
      }),
      codproduto: data.codproduto,
      codrevenda: revenda.id,
      campanha: data.campanha,
      versao: data.versao,
      createdAt: expect.any(Date),
    });
  });

  it('Deve criar um contrato secundário', async () => {
    const contrato = await Factory.create();
    const requester: any = { ...revenda };
    requester.identity = await getIdentity(revenda);

    const data = {
      dataInicio: new Date(),
      adminEmail: undefined,
      sufixo: undefined,
      codcliente: contrato.cliente.codcliente,
      codproduto: contrato.codproduto,
      codrevenda: contrato.codrevenda,
      contratoid: contrato.id,
      versao: 'a' as VersionType,
      campanha: 'promocional' as CampaignType,
    };

    const contract = await createContract(data, requester);

    expect(contract).toEqual({
      id: expect.any(Number),
      dataInicio: expect.any(String),
      adminEmail: data.adminEmail,
      sufixo: undefined,
      cliente: expect.objectContaining({
        codcliente: data.codcliente,
      }),
      codproduto: data.codproduto,
      status: 'ativo',
      codrevenda: revenda.id,
      createdAt: expect.any(Date),
      campanha: data.campanha,
      versao: data.versao,
      contrato: expect.objectContaining({
        id: expect.any(Number),
        sufixo: contrato.sufixo,
      }),
    });
  });

  it('Deve retornar erro do tipo NÃO ENCONTRADO se o cliente não existe.', async () => {
    const data = {
      dataInicio: new Date(),
      sufixo: faker.random.word(),
      adminEmail: faker.internet.email(),
      codcliente: 12345678,
      codproduto: getRandomProduto().codproduto,
      versao: 'a' as VersionType,
      campanha: 'promocional' as CampaignType,
    };

    const requester: any = { ...revenda };
    requester.identity = await getIdentity(revenda);

    await expect(createContract(data, requester)).rejects.toThrow(
      NotFoundError
    );
    await expect(createContract(data, requester)).rejects.toThrow(
      NotFoundError
    );
  });

  it('Deve retornar erro do tipo NÃO ENCONTRADO se o produto não existe.', async () => {
    const data = {
      dataInicio: new Date(),
      sufixo: faker.random.word(),
      adminEmail: faker.internet.email(),
      codcliente: getRandomCliente().codcliente,
      codproduto: 12345678,
      versao: 'a' as VersionType,
      campanha: 'promocional' as CampaignType,
    };

    const requester: any = { ...revenda };
    requester.identity = await getIdentity(revenda);

    await expect(createContract(data, requester)).rejects.toThrow(
      NotFoundError
    );
    await expect(createContract(data, requester)).rejects.toThrow(
      NotFoundError
    );
  });

  it('Deve retornar erro REQUISIÇÃO RUIM se algum dos dados obrigatórios não for enviado', async () => {
    const data = {
      dataInicio: undefined,
      sufixo: faker.random.word(),
      adminEmail: faker.internet.email(),
      codcliente: getRandomCliente().codcliente,
      codproduto: getRandomProduto().codproduto,
      versao: 'a' as VersionType,
      campanha: 'promocional' as CampaignType,
    };

    const requester: any = { ...revenda };
    requester.identity = await getIdentity(revenda);

    await expect(createContract(data, requester)).rejects.toThrow(
      BadRequestError
    );
  });

  it('Deve retornar erro REQUISIÇÃO RUIM se não é enviado nenhum cliente', async () => {
    const data = {
      dataInicio: new Date(),
      sufixo: faker.random.word(),
      adminEmail: faker.internet.email(),
      codcliente: null,
      codproduto: getRandomProduto().codproduto,
      versao: 'a' as VersionType,
      campanha: 'promocional' as CampaignType,
    };

    const requester: any = { ...revenda };
    requester.identity = await getIdentity(revenda);

    await expect(createContract(data, requester)).rejects.toThrow(
      BadRequestError
    );
  });

  it('Deve retornar erro REQUISIÇÃO RUIM se algum dos clientes já possui contrato ativo.', async () => {
    const insert = await Factory.create();

    const data = {
      dataInicio: new Date(),
      sufixo: faker.random.word(),
      codcliente: insert.cliente.codcliente,
      codproduto: insert.codproduto,
      codrevenda: parseInt(revenda.id, 10),
      versao: 'a' as VersionType,
      campanha: 'promocional' as CampaignType,
    };

    const requester: any = { ...revenda };
    requester.identity = await getIdentity(revenda);

    await expect(createContract(data, requester)).rejects.toThrow(
      BadRequestError
    );
  });

  it('Deve retornar erro PROIBIDO se o técnico revenda não possui permissão Licenciar_Clientes.', async () => {
    const insert = await Factory.create();

    const data = {
      dataInicio: new Date(),
      sufixo: faker.random.word(),
      codcliente: insert.cliente.codcliente,
      codproduto: insert.codproduto,
      codrevenda: parseInt(revenda.id, 10),
      versao: 'a' as VersionType,
      campanha: 'promocional' as CampaignType,
      adminEmail: faker.internet.email(),
    };

    const requester: any = { ...tecnicoRevendaSemPermissaoContrato };
    requester.identity = await getIdentity(tecnicoRevendaSemPermissaoContrato);

    await expect(createContract(data, requester)).rejects.toThrow(
      ForbiddenError
    );
  });
});
