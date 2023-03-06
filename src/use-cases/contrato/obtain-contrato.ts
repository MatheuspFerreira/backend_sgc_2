import { NotFound as NotFoundError } from 'http-errors';
import { FindOneOptions, getRepository } from 'typeorm';
import { Contrato } from '../../database/entities';
import IRequester from '../../lib/interfaces/requester';
import validator from './validators/obtain-contrato';
import {
  podeConsultarClientes,
  useCodigoRevenda,
} from '../../lib/authorizations';

export default async function findOne(id: number, requester: IRequester) {
  await validator({
    id,
  });

  // Checar pela permissão Consultar_Meus_Clientes
  await podeConsultarClientes(requester);

  const codrevenda = useCodigoRevenda(requester);

  const query: FindOneOptions = {
    where: { id },
    relations: ['cliente'],
  };

  if (codrevenda) {
    query.where = {
      id,
      codrevenda,
    };
  }

  const contrato = await getRepository(Contrato).findOne(query);

  if (!contrato) {
    throw new NotFoundError('Contrato não encontrado');
  }

  return contrato;
}
