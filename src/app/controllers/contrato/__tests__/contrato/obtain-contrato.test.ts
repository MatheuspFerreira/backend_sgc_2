import * as request from 'supertest';

import { suporteDb } from '../../../../../database/db';
import {
  atendenteInativo,
  revenda,
  tecnicoRevendaInativo,
  tecnicoRevendaSemPermissaoContrato,
} from '../../../../../database/mock/users';
import { Contract as Factory } from '../../../../../database/factories';
import { truncate } from '../../../../../database/lib';
import server from '../../../../index';
import { createToken } from '../../../../../lib/token';

beforeEach(async () => {
  await truncate();
});

beforeAll(async () => {
  await suporteDb.connect();
});

afterAll(async () => {
  await suporteDb.close();
});

describe('INTEGRAÇÃO - Obter contrato', () => {
  it('Deve receber 200 pois não tem problemas (revenda)', async () => {
    const insert = await Factory.create();

    const URI = `/contratos/${insert.id}`;

    const { token: authToken } = await createToken(revenda);

    await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('Deve receber 401 pois não o usuário não está autenticado', async () => {
    const insert = await Factory.create();

    const URI = `/contratos/${insert.id}`;

    await request(server).get(URI).expect('Content-Type', /json/).expect(401);
  });

  it('Deve receber 400 pois o contrato não tem id inválido', async () => {
    const URI = `/contratos/ABC1234`;

    const { token: authToken } = await createToken(revenda);

    await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('Deve receber 404 pois o contrato não existe', async () => {
    const URI = `/contratos/0`;

    const { token: authToken } = await createToken(revenda);

    await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(404);
  });

  it('Deve receber 403 pois o usuário está inativo (técnico revenda)', async () => {
    const insert = await Factory.create();

    const URI = `/contratos/${insert.id}`;

    const { token: authToken } = await createToken(tecnicoRevendaInativo);

    await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(403);
  });

  it('Deve receber 403 pois o usuário não possui permissão "Consultar_Meus_Clientes" (técnico revenda)', async () => {
    const insert = await Factory.create();

    const URI = `/contratos/${insert.id}`;

    const { token: authToken } = await createToken(
      tecnicoRevendaSemPermissaoContrato
    );

    await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(403);
  });

  it('Deve receber 403 pois o usuário está inativo (atendente)', async () => {
    const insert = await Factory.create();

    const URI = `/contratos/${insert.id}`;

    const { token: authToken } = await createToken(atendenteInativo);

    await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(403);
  });
});
