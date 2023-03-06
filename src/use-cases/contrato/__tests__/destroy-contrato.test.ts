import {
  BadRequest as BadRequestError,
  NotFound as NotFoundError,
} from 'http-errors';

import obtainContract from '../obtain-contrato';
import destroyContract from '../destroy-contrato';
import { suporteDb } from '../../../database/db';
import { Contract as Factory } from '../../../database/factories';
import { truncate } from '../../../database/lib';
import { revenda2 } from '../../../database/mock/users';
import getIdentity from '../../../lib/get-identity';

beforeEach(async () => {
  await truncate();
});

beforeAll(async () => {
  await suporteDb.connect();
});

afterAll(async () => {
  await suporteDb.close();
});

describe('TESTE UNITÁRIO - Deletar Contrato Por Id', () => {
  it('Deve deletar o contrato previamente inserido', async () => {
    const insert = await Factory.create({
      codrevenda: revenda2.id,
    });
    const requester: any = { ...revenda2 };
    requester.identity = await getIdentity(revenda2);

    const state1 = await obtainContract(insert.id, requester);

    await destroyContract(state1.id, requester);

    await expect(obtainContract(insert.id, requester)).rejects.toThrow(
      NotFoundError
    );
  });

  it('Deve retornar erro do tipo REQUISIÇÃO COM MÁ FORMAÇÃO se o id não é um uuid válido', async () => {
    await Factory.create();

    const requester: any = { ...revenda2 };
    requester.identity = await getIdentity(revenda2);

    await expect(destroyContract(-5, requester)).rejects.toThrow(
      BadRequestError
    );
  });

  it('Deve retornar erro do tipo NÃO ENCONTRADO se o contrato não existe', async () => {
    const requester: any = { ...revenda2 };
    requester.identity = await getIdentity(revenda2);

    await expect(destroyContract(0, requester)).rejects.toThrow(NotFoundError);
  });
});
