import { Response } from 'express';
import RequestCustom from '../../../lib/types/RequestCustom';
import getAllRevendas from '../../../use-cases/revenda/getAll-revenda';


export default {
  async list({user: requester }: RequestCustom, res: Response) {
   const revenda = await getAllRevendas(requester) as unknown as any;

   if(revenda.error){
    return res.status(400).send(revenda);

   };

    return res.status(200).json(revenda);

  },

};
