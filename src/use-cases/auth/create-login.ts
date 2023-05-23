import {
  Unauthorized as UnauthorizedError,
  Forbidden as ForbiddenError,
} from 'http-errors';
import { getRepository } from 'typeorm';
import { Atendente, Revenda, TecnicoRevenda } from '../../database/entities';
import ICreateLogin from './interfaces/create-login';
import { createToken } from '../../lib/token';
import { checkEstaInativo } from '../../lib/authorizations';

function checkUserType(revenda: any, tecnicoRevenda: any, atendente: any) {
  if (revenda) {
    return {
      user: {
        id: revenda.codrevenda,
        name: revenda.razaosocial,
        ativa: revenda.ativa,
      },
      type: 'revenda',
    };
  }

  if (tecnicoRevenda) {
    return {
      user: {
        id: tecnicoRevenda.codrevenda,
        codtecnico: tecnicoRevenda.codtecnico,
        name: tecnicoRevenda.nome,
        inativo: tecnicoRevenda.inativo,
        podeConsultarMeusClientes: tecnicoRevenda.podeConsultarMeusClientes,
        podeLicenciarClientes: tecnicoRevenda.podeLicenciarClientes,
        podeSuspenderClientes: tecnicoRevenda.podeSuspenderClientes,
      },
      type: 'tecnicoRevenda',
    };
  }

  return {
    user: {
      id: atendente.registro,
      name: atendente.nome,
      ativo: atendente.ativo,
    },
    type: 'atendente',
  };
}

function getPermissions(user: any, type: string) {
  
  if (type !== 'tecnicoRevenda' && type !== 'revenda') {
    return ['**'];
  }else if(type === 'revenda'){
    return ['*'];
  }

  const permissions = [];
  

  if (user.podeConsultarMeusClientes === 'S') {
    permissions.push('podeConsultarMeusClientes');
  }

  if (user.podeLicenciarClientes === 'S') {
    permissions.push('podeLicenciarClientes');
  }

  if (user.podeSuspenderClientes === 'S') {
    permissions.push('podeSuspenderCliente');
  }

  return permissions;
}

export default async function createLogin(credentials: ICreateLogin) {
  const { email, password } = credentials;

  const [revenda, tecnicoRevenda, atendente] = await Promise.all([
    getRepository(Revenda).findOne({
      email,
      senha: password,
    }),
    getRepository(TecnicoRevenda).findOne({
      email,
      senha: password,
    }),
    getRepository(Atendente).findOne({
      login: email,
      senha: password,
    }),
  ]);

  if (!revenda && !tecnicoRevenda && !atendente) {
    throw new UnauthorizedError('Não autorizado');
  };

  // Um e-mail/senha só está em uma das três tabelas conforme regra de negócio
  const { user, type } = checkUserType(revenda, tecnicoRevenda, atendente);

  if (checkEstaInativo(user, type)) {
    throw new ForbiddenError('Usuário inativo');
  };

  const userObj = {
    name: user.name,
    id: user.id,
    codtecnico: user.codtecnico,
  };

  const { token } = await createToken({
    type,
    p: getPermissions(user, type),
    ...userObj,
  });

  return {
    user,
    token,
  };
}
