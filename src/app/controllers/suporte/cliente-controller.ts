import { Response } from 'express';
import RequestCustom from '../../../lib/types/RequestCustom';
import listClientes from '../../../use-cases/cliente/list-cliente';
import updateCliente from '../../../use-cases/cliente/update-cliente';
import storeCliente from '../../../use-cases/cliente/store-cliente';
import obtainCliente from '../../../use-cases/cliente/obtain-cliente';

export default {
  async list({ params, user: requester }: RequestCustom, res: Response) {
    const clientes = await listClientes(
      {
        busca: params.busca as unknown as string,
      },
      requester
    );
      
    return res.status(200).json(clientes);
  },

  async obtain({ params, user: requester }: RequestCustom, res: Response) {
    
    const cliente = await obtainCliente(
      {
        codcliente: params.codcliente as unknown as number,
      },
      requester
    );

    return res.status(200).json(cliente);
  },

  async update(
    { params, body, user: requester }: RequestCustom,
    res: Response
  ) {
    const cliente = await updateCliente(
      {
        codcliente: parseInt(params.codcliente, 10) as unknown as number,
        data: body,
      },
      requester
    );

    return res.status(200).json(cliente);
  },

  async store({ body, user: requester }: RequestCustom, res: Response) { 
    const cliente = await storeCliente(
      {
        data: body,
      },
      requester
    );
    
    return res.status(200).json(cliente);
  },
};
