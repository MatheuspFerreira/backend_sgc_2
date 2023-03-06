import * as request from 'supertest';

import { suporteDb } from '../../../../../database/db';
import { revenda } from '../../../../../database/mock/users';
import server from '../../../../index';
import { createToken } from '../../../../../lib/token';
import { Cliente } from '../../../../../database/factories';

beforeAll(async () => {
  await suporteDb.connect();
});

afterAll(async () => {
  await suporteDb.close();
});

describe('INTEGRAÇÃO - Criar Clientes', () => {
  it('Deve receber 200 pois não tem problemas (revenda)', async () => {
    const data = Cliente.genetateClienteData();

    const URI = `/suporte/clientes`;

    const { token: authToken } = await createToken(revenda);

    await request(server)
      .post(URI)
      .send(data)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('Deve receber 401 pois não o usuário não está autenticado', async () => {
    const data = Cliente.genetateClienteData();

    const URI = `/suporte/clientes`;

    await request(server)
      .post(URI)
      .send(data)
      .expect('Content-Type', /json/)
      .expect(401);
  });

  it('Deve receber 400 pois o dado enviado não é válido.', async () => {
    const data = Cliente.genetateClienteData();

    data.cnpj = 'ATUALIZADO AGORA';

    const URI = `/suporte/clientes`;

    const { token: authToken } = await createToken(revenda);

    await request(server)
      .post(URI)
      .send(data)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('Deve receber 422 pois o cliente já existe.', async () => {
    const cliente = await Cliente.create();
    const data = Cliente.genetateClienteData();

    data.cnpj = cliente.cnpj;

    const URI = `/suporte/clientes`;

    const { token: authToken } = await createToken(revenda);

    await request(server)
      .post(URI)
      .send(data)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(422);
  });
});
