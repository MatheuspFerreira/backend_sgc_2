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

describe('INTEGRAÇÃO - Atualizar Clientes', () => {
  it('Deve receber 200 pois não tem problemas (revenda)', async () => {
    const cliente = await Cliente.create();

    const data = {
      ...cliente,
      observacao: 'ATUALIZADO AGORA',
    };

    const URI = `/suporte/clientes/${cliente.codcliente}`;

    const { token: authToken } = await createToken(revenda);

    await request(server)
      .put(URI)
      .send(data)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('Deve receber 401 pois não o usuário não está autenticado', async () => {
    const cliente = await Cliente.create();

    const data = {
      ...cliente,
      observacao: 'ATUALIZADO AGORA',
    };

    const URI = `/suporte/clientes/${cliente.codcliente}`;

    await request(server)
      .put(URI)
      .send(data)
      .expect('Content-Type', /json/)
      .expect(401);
  });

  it('Deve receber 400 pois o dado enviado não é válido.', async () => {
    const cliente = await Cliente.create();

    const data = {
      ...cliente,
      cnpj: 'ATUALIZADO AGORA',
    };

    const URI = `/suporte/clientes/${cliente.codcliente}`;

    const { token: authToken } = await createToken(revenda);

    await request(server)
      .put(URI)
      .send(data)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('Deve receber 422 pois está tentando trocar o cnpj para um que já está cadastrado', async () => {
    const cliente = await Cliente.create();
    const cliente2 = await Cliente.create();

    const data = {
      ...cliente,
      observacao: 'ATUALIZADO AGORA',
      cnpj: cliente2.cnpj,
    };

    const URI = `/suporte/clientes/${cliente.codcliente}`;

    const { token: authToken } = await createToken(revenda);

    await request(server)
      .put(URI)
      .send(data)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(422);
  });
});
