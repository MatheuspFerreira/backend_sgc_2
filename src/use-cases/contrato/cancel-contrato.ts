import { Contrato } from '../../database/entities';
import IRequester from '../../lib/interfaces/requester';
import { getRepository } from 'typeorm';
import salvarLogAuditoriaContrato from '../log_auditoria/register-log';
import podeSuspenderClientes from '../../lib/authorizations/pode-suspender-clientes';

export default async function cancelUnit(prefix: string, id: string, requester: IRequester, comentario:string) {

  try {
    // Verifica se o Técnico da revenda tem permissão
    podeSuspenderClientes(requester);

    // Verifica se o Requester tem a permissão de Atendente Inspell
    if(requester.p[0] !== '**'){

      // Consulta a unidade no banco de dados.
      const contratoRepository = getRepository(Contrato);
      const contrato = await contratoRepository.findOne({ where: { sufixo:prefix , id } });
      
      if (!contrato) {
        throw new Error('contrato não encontrada.');
      };
      
      // Revenda e técnico só podem alterar status dos contratos que possuem mesmo cód da sua revenda
      if(contrato.codrevenda !== requester.id){
        throw new Error ('Você não tem permissão para realizar essa ação!');
      };
  
      // Revenda e Técnico não podem cancelar o contrato, somente solicar o cancelamento que será feito
      // pelo atendente da Inspell
      contrato.status = 'aguardando cancelamento';
      await contratoRepository.save(contrato);
  
      // Salva a ação no log
      salvarLogAuditoriaContrato(contrato,requester,'aguardando cancelamento', comentario); 
      return;
      
    };
    
    // Consulta a unidade no banco de dados.
    const contratoRepository = getRepository(Contrato);
    const contrato = await contratoRepository.findOne({ where: { sufixo:prefix, id } });

    if (!contrato) {
      throw new Error('contrato não encontrado.');
    };

    // Realiza a inativação do contrato.
    contrato.status = 'cancelado';
    await contratoRepository.save(contrato);

    // Salva a ação no log
    salvarLogAuditoriaContrato(contrato, requester, "cancelado", comentario);

    return;
    
  } catch (error) {
    throw new Error('Não foi possível Cancelar o contrato!');
    
  };

};
