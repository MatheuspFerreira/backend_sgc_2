import { NotFound as NotFoundError } from 'http-errors';
import { FindOneOptions, getRepository } from 'typeorm';
import { Contrato } from '../../database/entities';
import {
  podeLicenciarClientes,
  useCodigoRevenda,
} from '../../lib/authorizations';
import validator from './validators/obtain-contrato';
import IRequester from '../../lib/interfaces/requester';

export default async function destroy(id: number, requester: IRequester) {
  await validator({
    id,
  });

  // Checar pela permissão Consultar_Meus_Clientes
  await podeLicenciarClientes(requester);

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

  await getRepository(Contrato).delete({ id });

  return contrato;
}
