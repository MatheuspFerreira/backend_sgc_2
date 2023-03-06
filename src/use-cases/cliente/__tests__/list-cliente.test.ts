/*import { Forbidden as ForbiddenError } from 'http-errors';
import listClientes from '../list-cliente';
import { suporteDb } from '../../../database/db';
import { truncateClientes } from '../../../database/factories/cliente-factory';
import {
  revenda2,
  tecnicoRevendaSemPermissaoContrato,
  atendente,
  revenda3,
} from '../../../database/mock/users';
import { truncate } from '../../../database/lib';
import {
  Contract as ContractFactory,
  Cliente as ClienteFactory,
} from '../../../database/factories';
import getIdentity from '../../../lib/get-identity';

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

describe('TESTE UNITÁRIO - Listar Clientes', () => {
  it('Deve listar todos os clientes que possuem contrato com a revenda logada.', async () => {
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

    const list = await listClientes({}, revenda2);

    expect(list).toHaveLength(3);
  });

  it('Deve listar todos os clientes que possuem contrato com a revenda logada.', async () => {
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
          codrevenda: revenda3.id,
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

    const list = await listClientes({}, revenda2);

    expect(list).toHaveLength(2);
  });

  it('Deve listar todos os clientes, pois o usuário é um atendente ativo.', async () => {
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

    const list = await listClientes({}, atendente);

    expect(list.length).toBeGreaterThan(3);
  });

  it('Deve listar clientes que tenham "R123" na razão social', async () => {
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

    const list = await listClientes(
      {
        busca: 'R123',
      },
      revenda2
    );

    expect(list).toHaveLength(1);
    expect(list[0].razaosocial).toEqual('R123');
  });

  it('Deve listar clientes que tenham "CLIENTE" no nome fantasia', async () => {
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

    const list = await listClientes(
      {
        busca: 'CLIENTE',
      },
      revenda2
    );

    expect(list).toHaveLength(3);
    expect(
      list.every((cliente: any) => cliente.fantasia.match('CLIENTE'))
    ).toEqual(true);
  });

  it('Deve lista o cliente que tenha um cnpj específico', async () => {
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

    const list = await listClientes(
      {
        busca: clientes[2].cnpj,
      },
      revenda2
    );

    expect(list).toHaveLength(1);
    expect(list[0].cnpj).toEqual(clientes[2].cnpj);
  });

  it('Deve retornar uma lista vazia pois a busca não encontrou clientes pelo parâmetro "busca"', async () => {
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

    const list = await listClientes(
      {
        busca: 'CRISTIANO MESSI DA SILVA',
      },
      revenda2
    );

    expect(list).toHaveLength(0);
  });

  it('Deve receber um erro do tipo "PROIBIDO" caso o usuário seja um técnico revenda e não tenha a permissão "podeConsultarClientes"', async () => {
    const requester: any = { ...tecnicoRevendaSemPermissaoContrato };
    requester.identity = await getIdentity(tecnicoRevendaSemPermissaoContrato);

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
    await expect(
      listClientes(
        {
          busca: 'CRISTIANO MESSI DA SILVA',
        },
        requester
      )
    ).rejects.toThrow(ForbiddenError);
  });
});*/
