import { NotFound as NotFoundError } from 'http-errors';

export default function notFoundHandler() {
  throw new NotFoundError('Página não encontrada');
}
