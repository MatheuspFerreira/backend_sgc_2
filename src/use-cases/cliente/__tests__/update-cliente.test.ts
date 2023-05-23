/*import { BadRequest as BadRequestError } from 'http-errors';
import updateCliente from '../update-cliente';
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

describe('TESTE UNITÁRIO - Atualizar Clientes', () => {
  it('Deve atualizar um cliente', async () => {
    const cliente = await Cliente.create();

    const data = {
      codcliente: cliente.codcliente,
      data: {
        ...cliente,
        observacao: 'ATUALIZADO AGORA',
      },
    };

    const updated = await updateCliente(data, revenda2);

    expect(cliente.observacao).not.toEqual('ATUALIZADO AGORA');
    expect(updated.observacao).toEqual('ATUALIZADO AGORA');
  });

  it('Deve atualizar um cliente com telefone vazio', async () => {
    const cliente = await Cliente.create();

    const data = {
      codcliente: cliente.codcliente,
      data: {
        ...cliente,
        tel1: null,
        tel2: '',
      },
    };

    const updated = await updateCliente(data, revenda2);

    expect(cliente.tel1).not.toEqual(updated.tel1);
    expect(cliente.tel2).not.toEqual(updated.tel2);
    expect(updated.tel1).toBeNull();
    expect(updated.tel2).toEqual('');
  });

  it('Deve retornar erro do tipo REQUISIÇÃO COM MÁ FORMAÇÃO se o dado enviado é inválido.', async () => {
    const cliente = await Cliente.create();

    const data = {
      codcliente: cliente.codcliente,
      data: {
        ...cliente,
        cnpj: '',
      },
    };

    await expect(updateCliente(data, revenda2)).rejects.toThrow(
      BadRequestError
    );
  });
});*/
