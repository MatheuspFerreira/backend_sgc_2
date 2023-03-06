import { getConnection, getRepository } from 'typeorm';
import { UnprocessableEntity as UnprocessableEntityError } from 'http-errors';
import ICreateCliente from './interfaces/store-cliente';
import { Cliente } from '../../database/entities';
import validator from './validators/store-cliente';
import { podeLicenciarClientes } from '../../lib/authorizations';
import { send } from 'process';
import { clientes } from '../../database/mock/clientes';

export default async function storeCliente(
  { data }: ICreateCliente,
  requester: any
) {
  await validator({
    ...data,
  });

  await podeLicenciarClientes(requester);

  const exists = await getRepository(Cliente).findOne({
    where: {
      cnpj: data.cnpj,
    },
  });

  if (exists) {
    //throw new UnprocessableEntityError({message:'Este cliente já está cadastrado',});
    return {
      message:'Este cliente já está cadastrado', 
      data:exists
    }
    
  }

  const cliente = new Cliente();

  cliente.razaosocial = data.razaosocial;
  cliente.fantasia = data.fantasia;
  cliente.cnpj = data.cnpj;
  cliente.endereco = data.endereco;
  cliente.bairro = data.bairro;
  cliente.cidade = data.cidade;
  cliente.uf = data.uf;
  cliente.cep = data.cep;
  cliente.tel1 = data.tel1;
  cliente.tel2 = data.tel2;
  cliente.fax = data.fax;
  cliente.email = data.email;
  cliente.inscricaoestadual = data.inscricaoestadual;
  cliente.inscricaomunicipal = data.inscricaomunicipal;
  cliente.observacao = data.observacao;
  cliente.naoRecebeAtestado = data.naoRecebeAtestado;

  await getConnection().manager.save(cliente);

  return {
    message:'cliente foi cadastrado', 
    data:cliente
  }
}
