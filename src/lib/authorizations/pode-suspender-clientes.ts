import { Forbidden as ForbiddenError } from 'http-errors';

export default function podeSuspenderClientes({ type, identity }: any) {
  if (type === 'tecnicoRevenda') {
    if (identity.podeSuspenderClientes !== 'S') {
      throw new ForbiddenError('Operação não permitida');
    }
  }
}
