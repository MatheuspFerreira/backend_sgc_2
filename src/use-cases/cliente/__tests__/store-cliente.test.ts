/*
import {
  BadRequest as BadRequestError,
  UnprocessableEntity as UnprocessableEntityError,
} from 'http-errors';
import storeCliente from '../store-cliente';
import { suporteDb } from '../../../database/db';
import { Cliente } from '../../../database/factories';
import { revenda2 } from '../../../database/mock/users';

beforeAll(async () => {
  await suporteDb.connect();
});

beforeEach(async () => {
  await Cliente.truncateClientes();
});

afterAll(async () => {
  await suporteDb.close();
});

describe('TESTE UNITÁRIO - Criar Clientes', () => {
  it('Deve atualizar um cliente', async () => {
    const data = Cliente.genetateClienteData();

    const stored = await storeCliente({ data }, revenda2);

    expect(stored.codcliente).toBeGreaterThan(0);
    expect(stored.fantasia).toEqual('CLIENTE TESTE');
  });

  it('Deve retornar erro do tipo REQUISIÇÃO COM MÁ FORMAÇÃO se o dado enviado é inválido.', async () => {
    const data = Cliente.genetateClienteData();

    data.cnpj = 'ABC123';

    await expect(storeCliente({ data }, revenda2)).rejects.toThrow(
      BadRequestError
    );
  });

  it('Deve retornar erro do tipo ENTIDADE NÃO-PROCESSÁVEL se cliente já existe.', async () => {
    const cliente = await Cliente.create();
    const data = Cliente.genetateClienteData();

    data.cnpj = cliente.cnpj;

    await expect(storeCliente({ data }, revenda2)).rejects.toThrow(
      UnprocessableEntityError
    );
  });
});*/
