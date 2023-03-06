import { Forbidden as ForbiddenError } from 'http-errors';

export default function podeConsultarClientes({ type, identity }: any) {
  if (type === 'tecnicoRevenda') {
    if (identity.podeConsultarMeusClientes !== 'S') {
      throw new ForbiddenError('Operação não permitida');
    }
  }
}
