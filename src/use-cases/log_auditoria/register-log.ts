import { getRepository } from 'typeorm';
import { LogAuditoriaContrato } from '../../database/entities/log-auditoria.entity';
import IRequester from '../../lib/interfaces/requester';

export interface LogAuditoriaAcao {
  criado: 'criado';
  suspenso: 'suspenso';
  cancelado: 'cancelado';
  reativado: 'reativado';
}

export default async function salvarLogAuditoriaContrato(
  contrato: any,
  requester: IRequester,
  acao: LogAuditoriaAcao[keyof LogAuditoriaAcao],
  comentario: string | null = null
): Promise<void> {

  const logAuditoriaContratoRepository = getRepository(LogAuditoriaContrato);
  const novoLog = new LogAuditoriaContrato();
  
  novoLog.cdg_contrato = contrato.id;
  novoLog.cdg_revenda = contrato.codrevenda;
  
  if(requester.codtecnico){
    novoLog.cdg_tecrevenda = parseInt(requester.codtecnico) ?? null;
  };
  if (requester.p.toString() === '**') {
    novoLog.atendente_inspell = requester.id ?? null;
  };
  
  novoLog.cdg_cliente = contrato.codcliente;
  novoLog.acao = acao;
  novoLog.comentario = comentario;
  novoLog.createdAt = new Date();
  await logAuditoriaContratoRepository.save(novoLog);
}