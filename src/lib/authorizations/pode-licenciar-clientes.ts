import { Forbidden as ForbiddenError } from 'http-errors';

export default function podeLicenciarClientes({ type, identity }: any) {
  if (type === 'tecnicoRevenda') {
    if (identity.podeLicenciarClientes !== 'S') {
      throw new ForbiddenError('Operação não permitida');
    }
  }
}
