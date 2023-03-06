import * as request from 'supertest';

import { suporteDb } from '../../../../../database/db';
import { revenda } from '../../../../../database/mock/users';
import server from '../../../../index';
import { createToken } from '../../../../../lib/token';

beforeAll(async () => {
  await suporteDb.connect();
});

afterAll(async () => {
  await suporteDb.close();
});

describe('INTEGRAÇÃO - Listar Produtos', () => {
  it('Deve receber 200 pois não tem problemas (revenda)', async () => {
    const URI = `/suporte/produtos?limitPerPage=10&page=0`;

    const { token: authToken } = await createToken(revenda);

    await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('Deve receber 401 pois não o usuário não está autenticado', async () => {
    const URI = `/suporte/produtos?limitPerPage=10&page=0`;

    await request(server).get(URI).expect('Content-Type', /json/).expect(401);
  });
});
