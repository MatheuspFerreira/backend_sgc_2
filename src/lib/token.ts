import { Unauthorized as UnauthorizedError } from 'http-errors';
import * as Jwt from 'jsonwebtoken';

import config from '../config';

const { jwt } = config;

interface ITokenUser {
  type: string;
  id: string;
  name: string;
  p: string[];
}

export function createToken(user: ITokenUser, customConfigs: any = {}) {
  return {
    token: Jwt.sign({ ...user }, jwt.secret, {
      subject: user.id.toString(),
      expiresIn: jwt.expiresIn,
      ...customConfigs,
    }),
  };
}

export function verifyToken(token: string) {
  try {
    // @todo: Verificar se o usuário ainda existe
    
    return Jwt.verify(token, jwt.secret);
  } catch (err) {
    throw new UnauthorizedError('Não autorizado');
  }
}

export function decodeToken(token: string) {
  return Jwt.decode(token);
}
