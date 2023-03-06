import {
  BadRequest as BadRequestError,
  NotFound as NotFoundError,
  Forbidden as ForbiddenError,
} from 'http-errors';

import obtainContract from '../obtain-contrato';
import { suporteDb } from '../../../database/db';
import { Contract as Factory } from '../../../database/factories';
import { truncate } from '../../../database/lib';
import {
  revenda,
  tecnicoRevendaSemPermissaoContrato,
} from '../../../database/mock/users';
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

describe('TESTE UNITÁRIO - Obter Contrato Por Id', () => {
  it('Deve listar o contrato previamente inserido', async () => {
    const insert = await Factory.create();

    const requester: any = { ...revenda };
    requester.identity = await getIdentity(revenda);

    const contract = await obtainContract(insert.id, requester);

    expect(contract.id).toEqual(insert.id);
    expect(contract.cliente).toEqual(
      expect.objectContaining({
        codcliente: expect.any(Number),
      })
    );
  });

  it('Deve retornar erro do tipo REQUISIÇÃO COM MÁ FORMAÇÃO se o id não é um uuid válido', async () => {
    await Factory.create();

    const requester: any = { ...revenda };
    requester.identity = await getIdentity(revenda);

    await expect(obtainContract(-10.6, requester)).rejects.toThrow(
      BadRequestError
    );
  });

  it('Deve retornar erro do tipo NÃO ENCONTRADO se o contrato não existe', async () => {
    const requester: any = { ...revenda };
    requester.identity = await getIdentity(revenda);
    await expect(obtainContract(0, requester)).rejects.toThrow(NotFoundError);
  });

  it('Deve retornar erro do tipo PROIBIDO se o usuário é um técnico revenda e não possui a permissão Consultar_Meus_Clientes.', async () => {
    const insert = await Factory.create();
    const requester: any = { ...tecnicoRevendaSemPermissaoContrato };
    requester.identity = await getIdentity(tecnicoRevendaSemPermissaoContrato);
    await expect(obtainContract(insert.id, requester)).rejects.toThrow(
      ForbiddenError
    );
  });
});
