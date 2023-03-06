import listContracts from '../list-contrato';
import { suporteDb } from '../../../database/db';
import { Contract as Factory } from '../../../database/factories';
import { truncate } from '../../../database/lib';
import { revenda2 } from '../../../database/mock/users';

beforeEach(async () => {
  await truncate();
});

beforeAll(async () => {
  await suporteDb.connect();
});

afterAll(async () => {
  await suporteDb.close();
});

describe('TESTE UNITÁRIO - Listar Contratos', () => {
  it('Deve listar todas as contratos previamente inseridos', async () => {
    const inserts = Array.from({ length: 12 }, () =>
      Factory.create({
        codrevenda: revenda2.id,
      })
    );
    await Promise.all(inserts);

    const [list, list2] = await Promise.all([
      await listContracts({
        page: 0,
        limitPerPage: 10,
        requester: revenda2,
      }),
      await listContracts({
        page: 1,
        limitPerPage: 10,
        requester: revenda2,
      }),
    ]);

    expect(list[0]).toHaveLength(10);
    expect(list[1]).toEqual(12);
    expect(list[0].every((contrato) => !!contrato.cliente)).toEqual(true);
    expect(list2[0]).toHaveLength(2);
    expect(list2[1]).toEqual(12);
    expect(list2[0].every((contrato) => !!contrato.cliente)).toEqual(true);
  });
});
