import { Request, Response } from 'express';
import RequestCustom from '../../../lib/types/RequestCustom';
import listNotifications from '../../../use-cases/notificacao/list-notification';

export default {
  async list({ query, user }: RequestCustom, res: Response) {
    const notifications = await listNotifications({
      limitPerPage: query.limitPerPage as unknown as number,
      page: query.page as unknown as number,
      usuarioId: user.id,
      usuarioCodTecnico: user.codtecnico,
      unread: !!query.lida,
    });

    return res.status(200).json(notifications);
  },

  async show(_: Request, res: Response) {
    return res.status(404).send();
  },

  async update(_: Request, res: Response) {
    return res.status(404).send();
  },

  async destroy(_: Request, res: Response) {
    return res.status(404).send();
  },
};
