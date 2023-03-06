import { getRepository } from 'typeorm';
import { UnprocessableEntity as UnprocessableEntityError } from 'http-errors';
import IUpdateCliente from './interfaces/update-cliente';
import { Cliente } from '../../database/entities';
import validator from './validators/update-cliente';
import { podeConsultarClientes } from '../../lib/authorizations';

export default async function updateCliente(
  { codcliente, data }: IUpdateCliente,
  requester: any
) {
  const clienteData = await validator({
    codcliente,
    ...data,
  });

  await podeConsultarClientes(requester);

  const [oldEntity, newEntity] = await Promise.all([
    getRepository(Cliente).findOne({
      where: {
        codcliente,
      },
    }),
    getRepository(Cliente).findOne({
      where: {
        cnpj: clienteData.cnpj,
      },
    }),
  ]);

  if (
    clienteData.cnpj !== oldEntity.cnpj &&
    newEntity.codcliente !== oldEntity.codcliente
  ) {
    throw new UnprocessableEntityError('Este cliente já está cadastrado');
  }

  await getRepository(Cliente).update({ codcliente }, clienteData);

  return getRepository(Cliente).findOne(codcliente);
}
