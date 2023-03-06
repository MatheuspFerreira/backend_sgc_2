import {
  NotFound as NotFoundError,
  Forbidden as ForbiddenError,
} from 'http-errors';
import obtainCliente from '../obtain-cliente';
import { suporteDb } from '../../../database/db';
import {
  Cliente,
  Contract as ContractFactory,
} from '../../../database/factories';
import {
  revenda2,
  tecnicoRevendaSemPermissaoContrato,
  atendente,
  revenda3,
} from '../../../database/mock/users';
import { truncate } from '../../../database/lib';
import getIdentity from '../../../lib/get-identity';

beforeAll(async () => {
  await suporteDb.connect();
});

beforeEach(async () => {
  await truncate();
  await Cliente.truncateClientes();
});

afterAll(async () => {
  await suporteDb.close();
});

describe('TESTE UNITÁRIO - Obter Cliente', () => {
  it('Deve obter um cliente', async () => {
    const cliente = await Cliente.create();

    const inserts = Array.from({ length: 3 }, () =>
      ContractFactory.create({
        codrevenda: revenda2.id,
        cliente,
      })
    );
    await Promise.all(inserts);

    const data = {
      codcliente: cliente.codcliente,
    };

    const obtained = await obtainCliente(data, revenda2);

    expect(obtained.codcliente).toEqual(cliente.codcliente);
    expect(obtained.contratos).toHaveLength(3);
  });

  it('Deve obter um cliente sem restrições, pois é um atendente', async () => {
    const cliente = await Cliente.create();

    const data = {
      codcliente: cliente.codcliente,
    };

    const obtained = await obtainCliente(data, atendente);

    expect(obtained.codcliente).toEqual(cliente.codcliente);
    expect(obtained.contratos).toHaveLength(0);
  });

  it('Deve retornar erro do tipo NÃO ENCONTRADO se o cliente não existe.', async () => {
    const cliente = await Cliente.create();
    const data = {
      codcliente: cliente.codcliente,
    };

    await expect(obtainCliente(data, revenda2)).rejects.toThrow(NotFoundError);
  });

  it('Deve retornar erro do tipo NÃO ENCONTRADO se o cliente tem contrato ativo com outra revenda.', async () => {
    const cliente = await Cliente.create();

    const inserts = Array.from({ length: 3 }, () =>
      ContractFactory.create({
        codrevenda: revenda3.id,
        cliente,
      })
    );
    await Promise.all(inserts);
    const data = {
      codcliente: cliente.codcliente,
    };

    await expect(obtainCliente(data, revenda2)).rejects.toThrow(NotFoundError);
  });

  it('Deve retornar erro do tipo NÃO ENCONTRADO se o cliente não possui contratos ativos.', async () => {
    const data = {
      codcliente: 1,
    };

    await expect(obtainCliente(data, revenda2)).rejects.toThrow(NotFoundError);
  });

  it('Deve retornar erro do tipo PROIBIDO caso o usuário seja um técnico revenda e não tenha a permissão "podeConsultarClientes".', async () => {
    const requester: any = { ...tecnicoRevendaSemPermissaoContrato };
    requester.identity = await getIdentity(tecnicoRevendaSemPermissaoContrato);
    const data = {
      codcliente: 1,
    };

    await expect(obtainCliente(data, requester)).rejects.toThrow(
      ForbiddenError
    );
  });
});
