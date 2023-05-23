import { Response } from 'express';
import RequestCustom from '../../../lib/types/RequestCustom';
import getLastest from '../../../use-cases/tabPrecos/getLastest-tabPrecos';


export default {
  async lastest({ params, user: requester }: RequestCustom, res: Response) {
    const atendente = await getLastest(params.id, requester) as unknown as any;
    return res.status(200).json(atendente);
  },

};
