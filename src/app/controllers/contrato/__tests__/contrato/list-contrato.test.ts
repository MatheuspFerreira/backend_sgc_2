import * as request from 'supertest';

import { suporteDb } from '../../../../../database/db';
import {
  atendenteInativo,
  revenda,
  tecnicoRevendaInativo,
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

describe('Listar contratos - REST', () => {
  it('Deve receber 200 pois não tem problemas (revenda)', async () => {
    const inserts = Array.from({ length: 12 }, () => Factory.create());
    await Promise.all(inserts);

    const URI = `/contratos?limitPerPage=10&page=0`;

    const { token: authToken } = await createToken(revenda);

    await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('Deve receber 401 pois não o usuário não está autenticado', async () => {
    const URI = `/contratos?limitPerPage=10&page=0`;

    await request(server).get(URI).expect('Content-Type', /json/).expect(401);
  });

  it('Deve receber 403 pois o usuário está inativo (técnico revenda)', async () => {
    const inserts = Array.from({ length: 12 }, () => Factory.create());
    await Promise.all(inserts);

    const URI = `/contratos?limitPerPage=10&page=0`;

    const { token: authToken } = await createToken(tecnicoRevendaInativo);

    await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(403);
  });

  it('Deve receber 403 pois o usuário está inativo (técnico revenda)', async () => {
    const inserts = Array.from({ length: 12 }, () => Factory.create());
    await Promise.all(inserts);

    const URI = `/contratos?limitPerPage=10&page=0`;

    const { token: authToken } = await createToken(atendenteInativo);

    await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(403);
  });
});
