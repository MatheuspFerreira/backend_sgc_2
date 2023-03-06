import { Response, NextFunction } from 'express';
import {
  Forbidden as ForbiddenError,
  Unauthorized as UnauthorizedError,
} from 'http-errors';

import { checkEstaInativo } from '../lib/authorizations';
import getIdentity from '../lib/get-identity';
import { verifyToken, decodeToken } from '../lib/token';

import RequestCustom from '../lib/types/RequestCustom';

export default async function errorHandler(
  req: RequestCustom,
  res: Response,
  next: NextFunction
) {
  const [, token] = req.headers.authorization
    ? req.headers.authorization.split(' ')
    : [];

  if (!token || !verifyToken(token)) {
    return next(new UnauthorizedError('Não autorizado'));
  }

  req.user = decodeToken(token);

  const identity = await getIdentity(req.user);

  if (checkEstaInativo(identity, req.user.type)) {
    return next(new ForbiddenError('Usuário inativo'));
  }

  req.user.identity = identity;

  return next();
}
