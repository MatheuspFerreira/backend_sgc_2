import { Contrato } from '../../database/entities';
import IRequester from '../../lib/interfaces/requester';
import { getRepository } from 'typeorm';
import reactivate from '../../lib/api/reactivate-contrato';
import salvarLogAuditoriaContrato from '../log_auditoria/register-log';
import podeSuspenderClientes from '../../lib/authorizations/pode-suspender-clientes';

export default async function reactivateUnit(prefix: string, id: string, requester: IRequester) {

  // Verifica se o Técnico da revenda tem permissão
  podeSuspenderClientes(requester);
 
  // Consulta a unidade no banco de dados.
  const contratoRepository = getRepository(Contrato);
  const contrato = await contratoRepository.findOne({ where: { sufixo:prefix, id } });

  if (!contrato) {
    throw new Error('contrato não encontrado.');
  };

  // Contrato cancelado ou Aguardando cancelamento só podem ser reativados pelos Atendentes da Inspell
  if((contrato.status === 'cancelado' || contrato.status === 'aguardando cancelamento') && requester.p[0] !== '**'){
    throw new Error('Você não tem permissão para realizar essa ação, entre em contato com nossa equipe comercial!')

  };

  // Realiza a ativação da contrato.
  contrato.status = 'ativo';
  const saveContrato = await contratoRepository.save(contrato);
  if(!saveContrato){
    throw new Error('Não foi possível suspender o contrato.');
  };

  // Se for principal o ID sempre será 1 (ID no banco do iFitness)
  // Se for Multi-unidade será sempre contrato.id_ifitness_web
  if(contrato.tipo === 'multi-unidade'){
    const externalApi = await reactivate(prefix, contrato.id_ifitness_web);  
    
    if(externalApi.result === "false"){
      throw new Error(`${externalApi.msg}`);
    };  

  }else if(contrato.tipo === 'principal'){
    const externalApi = await reactivate(prefix, 1);

    if(externalApi.result === "false"){
      throw new Error(`${externalApi.msg}`);
    }; 

  };

  // Salva a ação no log
  salvarLogAuditoriaContrato(contrato,requester,"reativado");

};