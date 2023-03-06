/*

import { UnprocessableEntity as UnprocessableEntityError } from 'http-errors';

import canStore from '../can-store-contrato';

import { suporteDb } from '../../../database/db';
import { Contract as Factory } from '../../../database/factories';
import { truncate } from '../../../database/lib';
import { genetateClienteData } from '../../../database/factories/cliente-factory';
import { revenda, revenda2, revenda3 } from '../../../database/mock/users';
import { products } from '../../../database/mock/products';

beforeEach(async () => {
  await truncate();
});

beforeAll(async () => {
  await suporteDb.connect();
});

afterAll(async () => {
  await suporteDb.close();
});

describe('TESTE UNITÁRIO - Checar pré-condições do cliente', () => {
  it('Deve retornar vazio pois o cliente não existe', async () => {
    const data = {
      cnpj: genetateClienteData().cnpj,
      requester: revenda2,
    };

    const condicoes = await canStore(data);

    expect(condicoes).toBeUndefined();
  });

  it('Deve retornar o cliente que possui contrato inativo com outra revenda e seus contratos.', async () => {
    const contrato = await Factory.create({
      codrevenda: revenda2.id,
      dataInicio: '2021-09-01',
      status: 'cancelado',
    });

    const { cliente } = contrato;

    const data = {
      cnpj: cliente.cnpj,
      requester: revenda3,
    };

    const condicoes = await canStore(data);

    expect(condicoes).toEqual(
      expect.objectContaining({
        codcliente: expect.any(Number),
        contratos: expect.any(Array),
      })
    );
    expect(condicoes.contratos).toHaveLength(1);
  });

  it('Deve retornar o cliente que possui contrato ativo com essa revenda.', async () => {
    const contrato = await Factory.create({
      codrevenda: revenda2.id,
    });

    const { cliente } = contrato;

    const data = {
      cnpj: cliente.cnpj,
      requester: revenda2,
    };

    const condicoes = await canStore(data);

    expect(condicoes).toEqual(
      expect.objectContaining({
        codcliente: expect.any(Number),
        contratos: expect.any(Array),
      })
    );
    expect(condicoes.contratos).toHaveLength(1);
  });

  it('Deve retornar o cliente que possui contrato ativo com essa revenda.', async () => {
    const contratoData = await Factory.generateData();

    const contratosSecundarios = await Promise.all([
      Factory.create({
        codrevenda: revenda2.id,
        sufixo: undefined,
        cliente: contratoData.cliente,
      }),
      Factory.create({
        codrevenda: revenda2.id,
        sufixo: undefined,
        cliente: contratoData.cliente,
      }),
      Factory.create({
        codrevenda: revenda2.id,
        sufixo: undefined,
        cliente: contratoData.cliente,
      }),
    ]);

    const contrato = await Factory.create({
      codrevenda: revenda2.id,
      contratosSecundarios,
      cliente: contratoData.cliente,
    });

    const { cliente } = contrato;

    const data = {
      cnpj: cliente.cnpj,
      requester: revenda2,
    };

    const condicoes = await canStore(data);

    const contratoPrimarios = condicoes.contratos.filter((c) => !!c.sufixo);
    const contratoSecundarios = condicoes.contratos.filter((c) => !c.sufixo);

    expect(condicoes).toEqual(
      expect.objectContaining({
        codcliente: expect.any(Number),
        contratos: expect.any(Array),
      })
    );

    expect(contratoPrimarios).toHaveLength(1);
    expect(contratoSecundarios).toHaveLength(3);
  });

  it('Deve retornar o cliente que possui contrato ativo com outra revenda mas é a revenda Inspell.', async () => {
    const contrato = await Factory.create({
      codrevenda: revenda.id,
    });

    const { cliente } = contrato;

    const data = {
      cnpj: cliente.cnpj,
      requester: revenda,
    };

    const condicoes = await canStore(data);

    expect(condicoes).toEqual(
      expect.objectContaining({
        codcliente: expect.any(Number),
        contratos: expect.any(Array),
      })
    );
    expect(condicoes.contratos).toHaveLength(1);
  });

  it('Deve retornar o cliente que possui contrato inativo desse produto e revenda', async () => {
    const contrato = await Factory.create({
      codrevenda: revenda2.id,
      codproduto: products[0].codproduto,
      dataInicio: '2021-09-01',
    });

    const { cliente } = contrato;

    const data = {
      cnpj: cliente.cnpj,
      requester: revenda2,
    };

    const condicoes = await canStore(data);

    expect(condicoes).toEqual(
      expect.objectContaining({
        codcliente: expect.any(Number),
        contratos: expect.any(Array),
      })
    );
    expect(condicoes.contratos).toHaveLength(1);
  });

  it('Deve retornar 422 pois o cliente possui contrato ativo com outra revenda.', async () => {
    const contrato = await Factory.create({
      codrevenda: revenda2.id,
    });

    const { cliente } = contrato;

    const data = {
      cnpj: cliente.cnpj,
      requester: revenda3,
    };

    await expect(canStore(data)).rejects.toThrow(UnprocessableEntityError);
  });

  it('Deve retornar 422 pois o cliente possui contrato suspenso com outra revenda.', async () => {
    const contrato = await Factory.create({
      codrevenda: revenda2.id,
      status: 'suspenso',
    });

    const { cliente } = contrato;

    const data = {
      cnpj: cliente.cnpj,
      requester: revenda3,
    };

    await expect(canStore(data)).rejects.toThrow(UnprocessableEntityError);
  });
});
?*/
