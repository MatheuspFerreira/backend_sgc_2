import { getRepository, IsNull } from 'typeorm';
import IListNotifications from './interfaces/list-notification';
import { Notificacao } from '../../database/entities';
import validator from './validators/list-notification';

export default async function listNotifications({
  limitPerPage,
  page,
  usuarioId,
  usuarioCodTecnico,
  unread,
}: IListNotifications) {
  await validator({
    limitPerPage,
    page,
    usuarioId,
    usuarioCodTecnico,
    unread,
  });

  const qwhere: any = {
    usuarioId,
  };

  if (unread) {
    qwhere.lidaEm = IsNull();
  }

  if (usuarioCodTecnico) {
    qwhere.usuarioCodTecnico = usuarioCodTecnico;
  }

  return getRepository(Notificacao).findAndCount({
    skip: page * limitPerPage,
    take: limitPerPage,
    order: {
      createdAt: 'DESC',
      lidaEm: 'DESC',
    },
    where: qwhere,
  });
}
