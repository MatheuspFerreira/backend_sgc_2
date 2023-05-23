import { Response } from 'express';
import RequestCustom from '../../../lib/types/RequestCustom';
import getAllAtendentes from '../../../use-cases/atendente/getAll-atendente';
import autoCompleteAtendente from '../../../use-cases/atendente/autoComplete-atendente';


export default {
  async list({user: requester }: RequestCustom, res: Response) {
   const atendente = await getAllAtendentes(requester) as unknown as any;
    return res.status(200).json(atendente);
    
  },
   async autoComplete({ body, user: requester }: RequestCustom, res: Response) {
    const revenda = await autoCompleteAtendente(body, requester);  
    return res.status(200).json(revenda);

  }

};
