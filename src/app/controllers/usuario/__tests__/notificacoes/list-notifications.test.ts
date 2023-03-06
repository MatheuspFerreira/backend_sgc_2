import * as request from 'supertest';

import { suporteDb } from '../../../../../database/db';
import { revenda, tecnicoRevenda } from '../../../../../database/mock/users';
import { Notification as Factory } from '../../../../../database/factories';
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

describe('Listar notificações - REST', () => {
  it('Deve receber 200 pois não tem problemas (revenda)', async () => {
    const inserts = Array.from({ length: 12 }, () =>
      Factory.create({
        userId: revenda.id,
      })
    );
    await Promise.all(inserts);

    const URI = `/usuarios/notificacoes?limitPerPage=10&page=0`;

    const { token: authToken } = await createToken(revenda);

    await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('Deve receber 200 pois não tem problemas (técnico-revenda)', async () => {
    const inserts = Array.from({ length: 12 }, () =>
      Factory.create({
        userId: tecnicoRevenda.id,
        userCodTecnico: tecnicoRevenda.codtecnico,
      })
    );
    await Promise.all(inserts);
    const URI = `/usuarios/notificacoes?limitPerPage=10&page=0`;

    const { token: authToken } = await createToken(tecnicoRevenda);

    await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('Deve receber 401 pois não o usuário não está autenticado', async () => {
    const URI = `/usuarios/notificacoes?limitPerPage=10&page=0`;

    await request(server).get(URI).expect('Content-Type', /json/).expect(401);
  });
});
