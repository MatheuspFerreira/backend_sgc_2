import * as createHttpError from 'http-errors';
import constants from '../../../database/constants';

import { Cliente, Contrato } from '../../../database/entities';

const { revendaInspell } = constants.clients;

function hasActiveContract(contract: Contrato, codrevenda: number) {
  // Se a revenda do contrato é inspell, é uma prospecção. O cliente vai trocar
  // de revenda e por isso, consideramos que não é um contrato ativo impeditivo.
  const checkRevenda = contract.codrevenda !== revendaInspell.codrevenda;

  const isContratoAtivo = ['ativo', 'suspenso'].includes(contract.status);

  // Checa se é um contrato com o mesmo produto e revenda
  const checkProdutoRevenda = contract.codrevenda !== codrevenda;

  return checkRevenda && isContratoAtivo && checkProdutoRevenda;
}

export default async function hasActiveContracts(
  cliente: Cliente,
  requesterId: number,
  
) {


  // Se é um cliente já licenciado por outra revenda
  if (
    cliente &&
    cliente.contratos &&
    cliente.contratos.length > 0 &&
    cliente.contratos.some((contract) =>
      hasActiveContract(contract, Number(requesterId))
    )
  ) {
    // @todo: disparar notificação para atendentes inspell
    throw createHttpError(
      422,
      `
      Este cliente é atendido por outro revendedor autorizado.
      Para mais informações, busque apoio de nossa equipe comercial.
    `,
      cliente
    );
  }
}
