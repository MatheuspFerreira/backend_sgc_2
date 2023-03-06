import * as faker from 'faker';

import { getRepository } from 'typeorm';
import { Notificacao as Entity } from '../entities';

export function create({ userId, userCodTecnico = null, lidaEm }: any) {
  return getRepository(Entity).insert({
    titulo: faker.lorem.word(),
    mensagem: faker.lorem.words(),
    categoria: 'info',
    usuarioId: userId as unknown as number,
    usuarioCodTecnico: userCodTecnico as unknown as number,
    lidaEm,
  });
}
