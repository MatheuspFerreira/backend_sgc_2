import { getRepository } from 'typeorm';
import { Atendente, Revenda, TecnicoRevenda } from '../database/entities';

export default async function getIdentity(requester: any) {
  if (requester.type === 'tecnicoRevenda') {
    return getRepository(TecnicoRevenda).findOne({
      where: {
        codrevenda: requester.id,
        codtecnico: requester.codtecnico,
      },
    });
  }

  if (requester.type === 'revenda') {
    return getRepository(Revenda).findOne({
      where: {
        codrevenda: requester.id,
      },
    });
  }

  return getRepository(Atendente).findOne({
    where: {
      registro: requester.id,
    },
  });
}
