import listNotifications from '../list-notification';
import { suporteDb } from '../../../database/db';
import { Notification as Factory } from '../../../database/factories';
import { truncate } from '../../../database/lib';
import * as users from '../../../database/mock/users';

beforeEach(async () => {
  await truncate();
});

beforeAll(async () => {
  await suporteDb.connect();
});

afterAll(async () => {
  await suporteDb.close();
});

describe('TESTE UNITÁRIO - Listar Notificações', () => {
  it('Deve listar todas as notificações previamente inseridas (todas)', async () => {
    const inserts = Array.from({ length: 12 }, () =>
      Factory.create({
        userId: users.revenda.id,
      })
    );
    await Promise.all(inserts);

    const [list, list2] = await Promise.all([
      await listNotifications({
        page: 0,
        limitPerPage: 10,
        usuarioId: users.revenda.id,
      }),
      await listNotifications({
        page: 1,
        limitPerPage: 10,
        usuarioId: users.revenda.id,
      }),
    ]);

    expect(list[0]).toHaveLength(10);
    expect(list[1]).toEqual(12);
    expect(list2[0]).toHaveLength(2);
    expect(list2[1]).toEqual(12);
  });

  it('Deve listar todas as notificações previamente inseridas (apenas não lidas)', async () => {
    const inserts = Array.from({ length: 12 }, (v, i) =>
      Factory.create({
        userId: users.revenda.id,
        lidaEm: i % 3 === 0 ? null : new Date(),
      })
    );
    await Promise.all(inserts);

    const list = await listNotifications({
      page: 0,
      limitPerPage: 10,
      usuarioId: users.revenda.id,
      unread: true,
    });

    expect(list[0]).toHaveLength(4);
    expect(list[1]).toEqual(4);
  });
});
