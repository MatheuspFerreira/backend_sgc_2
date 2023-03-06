import * as request from 'supertest';

import { suporteDb } from '../../../../../database/db';
import {
  revenda2,
  tecnicoRevendaSemPermissaoContrato,
  atendente,
} from '../../../../../database/mock/users';
import server from '../../../../index';
import { createToken } from '../../../../../lib/token';
import {
  Cliente,
  Contract as ContractFactory,
} from '../../../../../database/factories';

import { truncate } from '../../../../../database/lib';

beforeAll(async () => {
  await suporteDb.connect();
});

beforeEach(async () => {
  await truncate();
  await Cliente.truncateClientes();
});

afterAll(async () => {
  await suporteDb.close();
});

describe('INTEGRAÇÃO - Obter Cliente', () => {
  it('Deve receber 200 pois não tem problemas (revenda)', async () => {
    const cliente = await Cliente.create();

    const inserts = Array.from({ length: 3 }, () =>
      ContractFactory.create({
        codrevenda: revenda2.id,
        cliente,
      })
    );
    await Promise.all(inserts);
    const URI = `/suporte/clientes/${cliente.codcliente}`;

    const { token: authToken } = await createToken(revenda2);

    await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('Deve receber 200 pois é um atendente', async () => {
    const cliente = await Cliente.create();

    const URI = `/suporte/clientes/${cliente.codcliente}`;

    const { token: authToken } = await createToken(atendente);

    await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('Deve receber 404 pois o cliente buscado não existe.', async () => {
    const URI = `/suporte/clientes/1`;

    const { token: authToken } = await createToken(revenda2);

    await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(404);
  });

  it('Deve receber 404 pois o identificador do cliente não é válido.', async () => {
    const URI = `/suporte/clientes/ABC`;

    const { token: authToken } = await createToken(revenda2);

    await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(404);
  });

  it('Deve receber 404 pois o cliente não possui contratos ativos.', async () => {
    const cliente = await Cliente.create();
    const URI = `/suporte/clientes/${cliente.codcliente}`;

    const { token: authToken } = await createToken(revenda2);

    await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(404);
  });

  it('Deve receber 401 pois não o usuário não está autenticado.', async () => {
    const cliente = await Cliente.create();
    const URI = `/suporte/clientes/${cliente.codcliente}`;

    await request(server).get(URI).expect('Content-Type', /json/).expect(401);
  });

  it('Deve receber 403 pois o técnico revenda não possui a permissão "podeConsultarClientes".', async () => {
    const cliente = await Cliente.create();
    const URI = `/suporte/clientes/${cliente.codcliente}`;

    const { token: authToken } = await createToken(
      tecnicoRevendaSemPermissaoContrato
    );

    await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(403);
  });
});
