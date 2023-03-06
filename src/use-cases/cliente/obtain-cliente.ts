import { getRepository } from 'typeorm';
import { NotFound as NotFoundError } from 'http-errors';
import { Cliente } from '../../database/entities';
import IObtainCliente from './interfaces/obtain-cliente';
import {
  podeConsultarClientes,
  useCodigoRevenda,
} from '../../lib/authorizations';

import constants from '../../database/constants';

const { revendaInspell } = constants.clients;

export default async function listClientes(
  { codcliente }: IObtainCliente,
  requester: any
) {
  await podeConsultarClientes(requester);

  const codrevenda = useCodigoRevenda(requester);
  

  const cliente = await getRepository(Cliente).findOne({
    where: {
      codcliente,
    },
    relations: ['contratos'],
  });
 //console.log(cliente)

  if (!cliente) {
    throw new NotFoundError('Cliente não encontrado');
  }

  if (codrevenda) {
    if (
      cliente.contratos.length === 0 ||
      cliente.contratos.some(
        (contrato) =>
          contrato.codrevenda !== codrevenda &&
          contrato.codrevenda !== revendaInspell.codrevenda &&
          ['ativo', 'suspenso'].includes(contrato.status)
      )
    ) {
      throw new NotFoundError('Cliente não encontrado');
    }
  }

  return cliente;
}
