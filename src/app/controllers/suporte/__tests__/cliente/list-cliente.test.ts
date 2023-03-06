import * as request from 'supertest';

import { suporteDb } from '../../../../../database/db';
import {
  revenda2,
  tecnicoRevendaSemPermissaoContrato,
  atendente,
  tecnicoRevendaInativo,
} from '../../../../../database/mock/users';
import server from '../../../../index';
import { createToken } from '../../../../../lib/token';
import { truncate } from '../../../../../database/lib';
import {
  Contract as ContractFactory,
  Cliente as ClienteFactory,
} from '../../../../../database/factories';

import { truncateClientes } from '../../../../../database/factories/cliente-factory';

beforeAll(async () => {
  await suporteDb.connect();
});

afterAll(async () => {
  await suporteDb.close();
});

beforeEach(async () => {
  await truncate();
  await truncateClientes();
});

describe('INTEGRAÇÃO - Listar Clientes', () => {
  it('Deve receber 200 pois não tem problemas (revenda)', async () => {
    const clientes = await Promise.all(
      Array.from({ length: 3 }, () => ClienteFactory.create())
    );
    const inserts = [
      ...Array.from({ length: 3 }, () =>
        ContractFactory.create({
          codrevenda: revenda2.id,
          cliente: clientes[0],
        })
      ),
      ...Array.from({ length: 3 }, () =>
        ContractFactory.create({
          codrevenda: revenda2.id,
          cliente: clientes[1],
        })
      ),
      ...Array.from({ length: 3 }, () =>
        ContractFactory.create({
          codrevenda: revenda2.id,
          cliente: clientes[2],
        })
      ),
    ];
    await Promise.all(inserts);

    const URI = `/suporte/clientes`;

    const { token: authToken } = await createToken(revenda2);

    await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('Deve receber 200 pois não tem problemas (atendente ativo)', async () => {
    const clientes = await Promise.all(
      Array.from({ length: 3 }, () => ClienteFactory.create())
    );
    const inserts = [
      ...Array.from({ length: 3 }, () =>
        ContractFactory.create({
          codrevenda: revenda2.id,
          cliente: clientes[0],
        })
      ),
      ...Array.from({ length: 3 }, () =>
        ContractFactory.create({
          codrevenda: revenda2.id,
          cliente: clientes[1],
        })
      ),
      ...Array.from({ length: 3 }, () =>
        ContractFactory.create({
          codrevenda: revenda2.id,
          cliente: clientes[2],
        })
      ),
    ];
    await Promise.all(inserts);

    const URI = `/suporte/clientes`;

    const { token: authToken } = await createToken(atendente);

    const { body } = await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(body.length).toBeGreaterThan(1);
  });

  it('Deve receber 200 pois não tem problemas ao buscar por razão social (revenda)', async () => {
    const clientes = await Promise.all(
      Array.from({ length: 3 }, (v, i) => {
        if (i === 0) {
          return ClienteFactory.create({
            razaosocial: 'R123',
          });
        }
        return ClienteFactory.create();
      })
    );

    const inserts = [
      ...Array.from({ length: 3 }, () =>
        ContractFactory.create({
          codrevenda: revenda2.id,
          cliente: clientes[0],
        })
      ),
      ...Array.from({ length: 3 }, () =>
        ContractFactory.create({
          codrevenda: revenda2.id,
          cliente: clientes[1],
        })
      ),
      ...Array.from({ length: 3 }, () =>
        ContractFactory.create({
          codrevenda: revenda2.id,
          cliente: clientes[2],
        })
      ),
    ];
    await Promise.all(inserts);

    const URI = `/suporte/clientes?busca=R123`;

    const { token: authToken } = await createToken(revenda2);

    const { body } = await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(body.length).toEqual(1);
  });

  it('Deve receber 200 pois não tem problemas ao buscar por nome fantasia (revenda)', async () => {
    const clientes = await Promise.all(
      Array.from({ length: 3 }, () => ClienteFactory.create())
    );

    const inserts = [
      ...Array.from({ length: 3 }, () =>
        ContractFactory.create({
          codrevenda: revenda2.id,
          cliente: clientes[0],
        })
      ),
      ...Array.from({ length: 3 }, () =>
        ContractFactory.create({
          codrevenda: revenda2.id,
          cliente: clientes[1],
        })
      ),
      ...Array.from({ length: 3 }, () =>
        ContractFactory.create({
          codrevenda: revenda2.id,
          cliente: clientes[2],
        })
      ),
    ];
    await Promise.all(inserts);

    const URI = `/suporte/clientes?busca=CLIENTE`;

    const { token: authToken } = await createToken(revenda2);

    const { body } = await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(body).toHaveLength(3);
  });

  it('Deve receber 200 pois não tem problemas ao buscar por CNPJ completo (revenda)', async () => {
    const clientes = await Promise.all(
      Array.from({ length: 3 }, () => ClienteFactory.create())
    );

    const inserts = [
      ...Array.from({ length: 3 }, () =>
        ContractFactory.create({
          codrevenda: revenda2.id,
          cliente: clientes[0],
        })
      ),
      ...Array.from({ length: 3 }, () =>
        ContractFactory.create({
          codrevenda: revenda2.id,
          cliente: clientes[1],
        })
      ),
      ...Array.from({ length: 3 }, () =>
        ContractFactory.create({
          codrevenda: revenda2.id,
          cliente: clientes[2],
        })
      ),
    ];
    await Promise.all(inserts);

    const URI = `/suporte/clientes?busca=${clientes[2].cnpj}`;

    const { token: authToken } = await createToken(revenda2);

    const { body } = await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(body).toHaveLength(1);
  });

  it('Deve receber 200 mesmo que não encontre nenhum cliente (revenda)', async () => {
    const URI = `/suporte/clientes?busca=CRISTIANO MESSI DA SILVA`;

    const { token: authToken } = await createToken(revenda2);

    const { body } = await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(body).toHaveLength(0);
  });

  it('Deve receber 401 pois não o usuário não está autenticado', async () => {
    const URI = `/suporte/clientes`;

    await request(server).get(URI).expect('Content-Type', /json/).expect(401);
  });

  it('Deve receber 403 caso o usuário não esteja ativo.', async () => {
    const URI = `/suporte/clientes`;

    const clientes = await Promise.all(
      Array.from({ length: 3 }, () => ClienteFactory.create())
    );

    const inserts = [
      ...Array.from({ length: 3 }, () =>
        ContractFactory.create({
          codrevenda: revenda2.id,
          cliente: clientes[0],
        })
      ),
      ...Array.from({ length: 3 }, () =>
        ContractFactory.create({
          codrevenda: revenda2.id,
          cliente: clientes[1],
        })
      ),
      ...Array.from({ length: 3 }, () =>
        ContractFactory.create({
          codrevenda: revenda2.id,
          cliente: clientes[2],
        })
      ),
    ];
    await Promise.all(inserts);

    const { token: authToken } = await createToken(tecnicoRevendaInativo);

    await request(server)
      .get(URI)
      .auth(authToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(403);
  });

  it('Deve receber 403 caso o usuário seja um técnico revenda e não tenha a permissão "podeConsultarClientes"', async () => {
    const URI = `/suporte/clientes`;

    const clientes = await Promise.all(
      Array.from({ length: 3 }, () => ClienteFactory.create())
    );

    const inserts = [
      ...Array.from({ length: 3 }, () =>
        ContractFactory.create({
          codrevenda: revenda2.id,
          cliente: clientes[0],
        })
      ),
      ...Array.from({ length: 3 }, () =>
        ContractFactory.create({
          codrevenda: revenda2.id,
          cliente: clientes[1],
        })
      ),
      ...Array.from({ length: 3 }, () =>
        ContractFactory.create({
          codrevenda: revenda2.id,
          cliente: clientes[2],
        })
      ),
    ];
    await Promise.all(inserts);

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
