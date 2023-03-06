import { Response } from 'express';
import RequestCustom from '../../../lib/types/RequestCustom';
import listContracts from '../../../use-cases/contrato/list-contrato';
import obtainContract from '../../../use-cases/contrato/obtain-contrato';
import storeContract from '../../../use-cases/contrato/store-contrato';
import destroyContract from '../../../use-cases/contrato/destroy-contrato';
import canStoreContract from '../../../use-cases/contrato/can-store-contrato';
import checkSufixoContrato from '../../../use-cases/contrato/check-sufixo-contrato';
import filterAtendente from '../../../use-cases/contrato/filter-contrato';
import deactivateUnit from '../../../use-cases/contrato/deactivate-contrato';
import reactivateUnit from '../../../use-cases/contrato/reactivate-contrato';
import cancelUnit from '../../../use-cases/contrato/cancel-contrato';

export default {
  async list({ query, user: requester }: RequestCustom, res: Response) {
    const contratos = await listContracts({
      limitPerPage: query.limitPerPage as unknown as number,
      page: query.page as unknown as number,
      codcliente: query.codcliente as unknown as number,
      requester,
    });

    return res.status(200).json(contratos);
  },

  async obtain({ params, user: requester }: RequestCustom, res: Response) {
    const contrato = await obtainContract(parseInt(params.id, 10), requester);

    return res.status(200).json(contrato);
  },

  async destroy({ params, user: requester }: RequestCustom, res: Response) {
    await destroyContract(parseInt(params.id, 10), requester);

    return res.status(204).send();
  },

  async canStore({ body, user: requester }: RequestCustom, res: Response) {
    //console.log(body)
    const cliente = await canStoreContract({
      cnpj: body.cnpj.replace(/[^\w\s]/g, ''),
      tipoDoc: body.tipoDoc,
      codRevenda:body.codRevenda,
      requester,
    });

    if(cliente) {
      return res.status(200).json(cliente);

    }else {
      return res.status(200).json(
        {
          message:'cliente não cadastrado, liberado para cadastro'
        }
      );

    };

  },

  async store({ body, user: requester }: RequestCustom, res: Response) {
    const contract = await storeContract(body, requester) as any;
    if(contract.error){
      return res.status(400).send(contract); 
    };    

    return res.status(201).json(contract);
    
  },

  async checkSufixo({ body }: RequestCustom, res: Response) {
    const validateSuffix = await checkSufixoContrato({
      sufixo: (body.sufixo || '').replace(/[^A-Za-z0-9]+/g, '').toLowerCase(),
    });
    return res.status(200).send(validateSuffix);
  },

  async filter({ body, user: requester }: RequestCustom, res: Response) {
    const contract = await filterAtendente(body, requester);  
    return res.status(201).json(contract); 
  },

  async deactivate({ params, user: requester }: RequestCustom, res: Response) {
    const { prefix, id } = params;
    await  deactivateUnit (prefix, id, requester);
    return res.status(204).send();
  },

  async reactivate({ params, user: requester }: RequestCustom, res: Response) {
   const { prefix, id } = params;
    await reactivateUnit(prefix, id, requester);
    return res.status(204).send();
  },

  async cancel({ params, user: requester }: RequestCustom, res: Response) {
    const { prefix, id } = params;
     await cancelUnit(prefix, id, requester);
     return res.status(204).send();
   },

};
