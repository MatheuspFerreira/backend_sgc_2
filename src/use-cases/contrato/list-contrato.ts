import { FindManyOptions, getRepository } from 'typeorm';
import IListContracts from './interfaces/list-contrato';
import { Contrato } from '../../database/entities';
import validator from './validators/list-contrato';
import {
  podeConsultarClientes,
  useCodigoRevenda,
} from '../../lib/authorizations';

export default async function listContract({
  limitPerPage,
  page,
  requester,
  codcliente,
}: IListContracts) {
  await validator({
    limitPerPage,
    page,
  });

  

  // Se for Atendente Inspell, consegue acessar todos os contratos cadastrados no banco de dados.
  if(requester.p.toString() === '**'){
  
    const query: FindManyOptions = {
      skip: Number(page) * Number(limitPerPage),
      take: Number(limitPerPage),
      order: { createdAt: 'DESC' },
      relations: ['cliente'],
    };

    return {
      contratos: await getRepository(Contrato).findAndCount(query),
      permission: requester.p

    };

  };

  // Só recebe os contratos criados por está revenda.
  await podeConsultarClientes(requester);
                                          

  const codrevenda = useCodigoRevenda(requester);

  const query: FindManyOptions = {
    skip: Number(page) * Number(limitPerPage),
    take: Number(limitPerPage),
    order: { createdAt: 'DESC' },
    relations: ['cliente'],
  };

  if (codrevenda) {
    query.where = { codrevenda };
  };

  if (codcliente) {
    query.where = { cliente: { codcliente: Number(codcliente) } };
  };


  return await getRepository(Contrato).findAndCount(query);
}