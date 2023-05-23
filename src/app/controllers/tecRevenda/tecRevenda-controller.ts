import { Response } from 'express';
import RequestCustom from '../../../lib/types/RequestCustom';
import getAllTecRevenda from '../../../use-cases/tecRevenda/getAll-tecRevenda';
import autoCompleteTecRevenda from '../../../use-cases/tecRevenda/autoComplete-tecRevenda';


export default {
  async list({user: requester }: RequestCustom, res: Response) {
   const tecrevenda = await getAllTecRevenda(requester) as unknown as any;
    return res.status(200).json(tecrevenda);
  },
  async autoComplete({ body, user: requester }: RequestCustom, res: Response) {
    const revenda = await autoCompleteTecRevenda(body, requester);  
    return res.status(200).json(revenda); 
  },
};
