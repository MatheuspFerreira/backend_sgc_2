import { getRepository } from 'typeorm';
import  LogAuditoriaContrato  from '../../database/entities/log-auditoria.entity';
import IRequester from '../../lib/interfaces/requester';

export default async function buscarLogsPorIdContrato(idContrato: number, requester:IRequester): Promise<LogAuditoriaContrato[]> {

  if(requester.p[0].toString() !== '**') {
    throw new Error('Você não possui permissão para realizar essa ação!');
  };

  const logAuditoriaContratoRepository = getRepository(LogAuditoriaContrato);
  const logs = await logAuditoriaContratoRepository.find({ where: { cdg_contrato:idContrato } });
  
  return logs;
  
}