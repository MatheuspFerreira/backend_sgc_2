import { Contrato } from '../../database/entities';
import IRequester from '../../lib/interfaces/requester';
import { getRepository } from 'typeorm';

export default async function cancelUnit(prefix: string, id: string, requester: IRequester) {

  // Consulta a unidade no banco de dados.
  const contratoRepository = getRepository(Contrato);
  const contrato = await contratoRepository.findOne({ where: { sufixo:prefix, id } });

  if (!contrato) {
    throw new Error('contrato não encontrada.');
  }

  // Realiza a inativação da contrato.
  contrato.status = 'cancelado';
  await contratoRepository.save(contrato);
}
