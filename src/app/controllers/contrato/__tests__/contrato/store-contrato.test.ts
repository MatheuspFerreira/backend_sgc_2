import * as request from 'supertest';
import * as faker from 'faker';

import { suporteDb } from '../../../../../database/db';
import { Contract as Factory } from '../../../../../database/factories';
import {
  atendenteInativo,
  revenda,
  tecnicoRevendaInativo,
  tecnicoRevendaSemPermissaoContrato,
} from '../../../../../database/mock/users';
import { truncate } from '../../../../../database/lib';
import { getRandomProduto } from '../../../../../database/mock/products';
import { getRandomCliente } from '../../../../../database/mock/clientes';
import server from '../../../../index';
import { createToken } from '../../../../../lib/token';
import VersionType from '../../../../../lib/types/VersionType';
import CampaignType from '../../../../../lib/types/CampaignType';

beforeEach(async () => {
  await truncate();
});

beforeAll(async () => {
  await suporteDb.connect();
});

afterAll(async () => {
  await suporteDb.close();
});

describe('INTEGRAÇÃO - Criar contrato', () => {
  it('Deve criar um contrato', async () => {
    const data = {
      dataInicio: new Date(),
      versao: 'a' as VersionType,
      campanha: 'promocional' as CampaignType,
      sufixo: faker.random.word(),
      adminEmail: faker.internet.email(),
      codcliente: getRandomCliente().codcliente,
      codproduto: getRandomProduto().codproduto,
    };
    const URI = `/contratos`;

    const { token: authToken } = await createToken(revenda);

    await request(server)
      .post(URI)
      .send(data)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(201);
  });

  it('Deve receber 401 pois não o usuário não está autenticado', async () => {
    const data = {
      dataInicio: new Date(),
      versao: 'a' as VersionType,
      campanha: 'promocional' as CampaignType,
      sufixo: faker.random.word(),
      adminEmail: faker.internet.email(),
      codcliente: getRandomCliente().codcliente,
      codproduto: getRandomProduto().codproduto,
    };
    const URI = `/contratos`;

    await request(server)
      .post(URI)
      .send(data)
      .expect('Content-Type', /json/)
      .expect(401);
  });

  it('Deve receber 400 pois está enviando dados inválidos no body', async () => {
    const data = {
      dataInicio: 'Uma data inválida aqui',
      versao: 'a' as VersionType,
      campanha: 'promocional' as CampaignType,
      sufixo: 123456,
      adminEmail: faker.internet.email(),
      codcliente: getRandomCliente().codcliente,
      codproduto: getRandomProduto().codproduto,
    };
    const URI = `/contratos`;

    const { token: authToken } = await createToken(revenda);

    await request(server)
      .post(URI)
      .send(data)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('Deve receber 400 pois não está enviando nenhum cliente', async () => {
    const data = {
      dataInicio: new Date(),
      versao: 'a' as VersionType,
      campanha: 'promocional' as CampaignType,
      sufixo: faker.random.word(),
      adminEmail: faker.internet.email(),
      codproduto: getRandomProduto().codproduto,
    };
    const URI = `/contratos`;

    const { token: authToken } = await createToken(revenda);

    await request(server)
      .post(URI)
      .send(data)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('Deve receber 404 pois o cliente não existe', async () => {
    const data = {
      dataInicio: new Date(),
      versao: 'a' as VersionType,
      campanha: 'promocional' as CampaignType,
      sufixo: faker.random.word(),
      adminEmail: faker.internet.email(),
      codcliente: 12345678,
      codproduto: getRandomProduto().codproduto,
    };
    const URI = `/contratos`;

    const { token: authToken } = await createToken(revenda);

    await request(server)
      .post(URI)
      .send(data)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(404);
  });

  it('Deve receber 404 pois o produto não existe', async () => {
    const data = {
      dataInicio: new Date(),
      versao: 'a' as VersionType,
      campanha: 'promocional' as CampaignType,
      sufixo: faker.random.word(),
      adminEmail: faker.internet.email(),
      codcliente: getRandomCliente().codcliente,
      codproduto: 12345678,
    };
    const URI = `/contratos`;

    const { token: authToken } = await createToken(revenda);

    await request(server)
      .post(URI)
      .send(data)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(404);
  });

  it('Deve receber 403 pois o usuário está inativo (técnico revenda)', async () => {
    const data = {
      dataInicio: new Date(),
      sufixo: faker.random.word(),
      codcliente: getRandomCliente().codcliente,
      codproduto: getRandomProduto().codproduto,
      codrevenda: parseInt(revenda.id, 10),
    };
    const URI = `/contratos`;

    const { token: authToken } = await createToken(tecnicoRevendaInativo);

    await request(server)
      .post(URI)
      .send(data)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(403);
  });

  it('Deve receber 403 pois o usuário está inativo (atendente)', async () => {
    const data = {
      dataInicio: new Date(),
      sufixo: faker.random.word(),
      codcliente: getRandomCliente().codcliente,
      codproduto: getRandomProduto().codproduto,
      codrevenda: parseInt(revenda.id, 10),
    };
    const URI = `/contratos`;

    const { token: authToken } = await createToken(atendenteInativo);

    await request(server)
      .post(URI)
      .send(data)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(403);
  });

  it('Deve receber 403 pois não possui permissão "Licenciar_Clientes".', async () => {
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
    const URI = `/contratos`;

    const { token: authToken } = await createToken(
      tecnicoRevendaSemPermissaoContrato
    );

    await request(server)
      .post(URI)
      .send(data)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(403);
  });
});
