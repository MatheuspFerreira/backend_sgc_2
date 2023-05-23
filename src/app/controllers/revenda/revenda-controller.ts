import { Response } from 'express';
import RequestCustom from '../../../lib/types/RequestCustom';
import AutoCompleteRevenda from '../../../use-cases/revenda/autoComplete-revendas';
import getAllActiveRevendas from '../../../use-cases/revenda/getAll-active-revendas';
import getAllRevendas from '../../../use-cases/revenda/getAll-revenda';


export default {
  async list({user: requester }: RequestCustom, res: Response) {
   const revenda = await getAllRevendas(requester) as unknown as any;
    return res.status(200).json(revenda);
  },
  async listActive({user: requester }: RequestCustom, res: Response) {
    const revenda = await getAllActiveRevendas (requester) as unknown as any;
    return res.status(200).json(revenda);
  },
  async autoComplete({ body, user: requester }: RequestCustom, res: Response) {
    const revenda = await AutoCompleteRevenda(body, requester);  
    return res.status(200).json(revenda); 
  },
};
