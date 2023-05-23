import { getRepository } from 'typeorm';
import { UnprocessableEntity as UnprocessableEntityError } from 'http-errors';
import IUpdateCliente from './interfaces/update-cliente';
import { Cliente, Contrato } from '../../database/entities';
import validator from './validators/update-cliente';
import { podeConsultarClientes } from '../../lib/authorizations';
import IRequester from '../../lib/interfaces/requester';

export default async function updateCliente(
  { codcliente, codcontrato, data }: IUpdateCliente,
  requester: IRequester
) {

  const clienteData = await validator({
    codcliente,
    ...data,
  });

  await podeConsultarClientes(requester);


  // Verifica se o status do contrato que solicitou a mudança do cadastro do cliente está ativo.
  const contrato = await getRepository(Contrato).find({
    where:{
      id:codcontrato
    }
  });


  if(contrato[0].status !== 'ativo'){
    throw new Error(`
      Você não tem permissão para realizar essa ação, para mais detalhes entre em contato com nossa equipe comercial.
    `)

  };


  const [oldEntity, newEntity] = await Promise.all([
    getRepository(Cliente).findOne({
      where: {
        codcliente
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
