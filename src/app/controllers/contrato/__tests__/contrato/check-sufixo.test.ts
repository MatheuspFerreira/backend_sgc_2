import * as request from 'supertest';

import { suporteDb } from '../../../../../database/db';
import { revenda } from '../../../../../database/mock/users';
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

describe('INTEGRAÇÃO - Checar sufixo', () => {
  it('Deve receber 200 pois o sufixo não existe no banco.', async () => {
    await Factory.create();

    const URI = `/contratos/condicoes/sufixo`;

    const { token: authToken } = await createToken(revenda);

    await request(server)
      .post(URI)
      .send({ sufixo: 'novosufixo' })
      .auth(authToken, { type: 'bearer' })
      .expect(200);
  });

  it('Deve receber 401 pois não o usuário não está autenticado', async () => {
    await Factory.create();

    const URI = `/contratos/condicoes/sufixo`;

    await request(server)
      .post(URI)
      .send({ sufixo: 'novosufixo' })
      .expect('Content-Type', /json/)
      .expect(401);
  });

  it('Deve receber 422 pois o sufixo já existe o contrato não tem id inválido', async () => {
    const contrato = await Factory.create();

    const URI = `/contratos/condicoes/sufixo`;

    const { token: authToken } = await createToken(revenda);

    await request(server)
      .post(URI)
      .auth(authToken, { type: 'bearer' })
      .send({ sufixo: contrato.sufixo })
      .expect('Content-Type', /json/)
      .expect(422);
  });
});
