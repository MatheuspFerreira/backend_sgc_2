import { Request, Response, NextFunction } from 'express';
import { InternalServerError, HttpError } from 'http-errors';

export default function errorHandler(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }

  if (!err.statusCode) {
    return res
      .status(500)
      .json(new InternalServerError('A requisição não pôde ser processada.'));
  }

  return res.status(err.statusCode).json(err);
}
