import { UnprocessableEntity as UnprocessableEntityError } from 'http-errors';
import { getRepository } from 'typeorm';
import { Contrato } from '../../database/entities';
import validator from './validators/check-sufixo-contrato';

export default async function checkSufixoContrato({
  sufixo,
}: {
  sufixo: string;
}) {
  await validator({ sufixo });

  const contrato = await getRepository(Contrato).findOne({
    sufixo,
  });

  if (contrato) {
    throw new UnprocessableEntityError('Este sufixo já está em uso.');
  }

  return true;
}
