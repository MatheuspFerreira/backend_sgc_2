import * as request from 'supertest';

import { suporteDb } from '../../../../../database/db';
import {
  revenda,
  revenda2,
  revenda3,
} from '../../../../../database/mock/users';
import {
  products,
  getRandomProduto,
} from '../../../../../database/mock/products';
import { Contract as ContratoFactory } from '../../../../../database/factories';
import { truncate } from '../../../../../database/lib';

import server from '../../../../index';
import { createToken } from '../../../../../lib/token';
import { genetateClienteData } from '../../../../../database/factories/cliente-factory';

beforeEach(async () => {
  await truncate();
});

beforeAll(async () => {
  await suporteDb.connect();
});

afterAll(async () => {
  await suporteDb.close();
});

describe('INTEGRAÇÃO - Checar pré-condições do cliente', () => {
  it('Deve retornar 200 pois o cliente não possui nenhum contrato ativo', async () => {
    const data = {
      cnpj: genetateClienteData().cnpj,
      codproduto: getRandomProduto().codproduto,
    };
    const URI = `/contratos/condicoes`;

    const { token: authToken } = await createToken(revenda2);

    await request(server)
      .post(URI)
      .send(data)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('Deve retornar 200 pois o cliente possui contrato inativo com outra revenda.', async () => {
    const contrato = await ContratoFactory.create({
      codrevenda: revenda2.id,
      dataInicio: '2021-09-01',
      status: 'cancelado',
    });

    const { cliente } = contrato;

    const data = {
      cnpj: cliente.cnpj,
      codproduto: contrato.codproduto,
    };
    const URI = `/contratos/condicoes`;

    const { token: authToken } = await createToken(revenda3);

    await request(server)
      .post(URI)
      .send(data)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('Deve retornar 200 pois o cliente possui contrato ativo com essa revenda.', async () => {
    const contrato = await ContratoFactory.create({
      codrevenda: revenda2.id,
      codproduto: products[0].codproduto,
    });

    const { cliente } = contrato;

    const data = {
      cnpj: cliente.cnpj,
      codproduto: products[0].codproduto,
    };
    const URI = `/contratos/condicoes`;

    const { token: authToken } = await createToken(revenda2);

    await request(server)
      .post(URI)
      .send(data)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('Deve retornar 200 pois o cliente possui contrato ativo com outra revenda mas é a revenda Inspell.', async () => {
    const contrato = await ContratoFactory.create({
      codrevenda: revenda.id,
      codproduto: products[0].codproduto,
    });

    const { cliente } = contrato;

    const data = {
      cnpj: cliente.cnpj,
      codproduto: products[0].codproduto,
    };
    const URI = `/contratos/condicoes`;

    const { token: authToken } = await createToken(revenda2);

    await request(server)
      .post(URI)
      .send(data)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('Deve retornar 200 pois o cliente possui contrato inativo desse produto e revenda', async () => {
    const contrato = await ContratoFactory.create({
      codrevenda: revenda2.id,
      codproduto: products[0].codproduto,
      dataInicio: '2021-09-01',
    });

    const { cliente } = contrato;

    const data = {
      cnpj: cliente.cnpj,
      codproduto: products[0].codproduto,
    };
    const URI = `/contratos/condicoes`;

    const { token: authToken } = await createToken(revenda2);

    await request(server)
      .post(URI)
      .send(data)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('Deve retornar 422 pois o cliente possui contrato ativo com outra revenda.', async () => {
    const contrato = await ContratoFactory.create({
      codrevenda: revenda2.id,
      codproduto: products[0].codproduto,
    });

    const { cliente } = contrato;

    const data = {
      cnpj: cliente.cnpj,
      codproduto: products[1].codproduto,
    };
    const URI = `/contratos/condicoes`;

    const { token: authToken } = await createToken(revenda3);

    await request(server)
      .post(URI)
      .send(data)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(422);
  });
});
