import { In, getRepository } from 'typeorm';
import { LogAuditoriaContrato } from '../../database/entities';
import IRequester from '../../lib/interfaces/requester';
import IFilterBodyLog from './interfaces/filter-body';
import createPagination from '../../lib/create-pagination';
import includeRazaoRevenda from '../../lib/include-razaoSocialRevenda';




export default async function filterLogs (requester:IRequester, body:IFilterBodyLog) {
   
  // Verifica se o requester ter permissão de nível Atendente Inspell
  if(requester.p[0].toString() !== '**') {    
    throw new Error ('Você não possui permissão para realizar essa ação!');
  };
  try{
        
    let {
      cdg_contrato = '',
      cdg_revenda = '',
      cdg_cliente = '',
      atendente_inspell ='',
      cdg_tecrevenda='',
      acao=[],
      datainicio='',
      datafinal='',
      page = 0,
      limitPerPage = 25
    } = body;

    // When no options are provided, return all logs for the given revenda.
    if (!acao.length && !cdg_contrato && !cdg_cliente && !datafinal && !datainicio && cdg_revenda) {
      let [logList, logCount] = await getRepository(LogAuditoriaContrato).findAndCount({
        where: {cdg_revenda},
        relations:['cliente']
        
      });
    
      if (logCount === 0) {
          return {
          error: true,
          message: 'Not Found',
        };
      }
    
      // Inclui a razão social da revenda no objeto
      const newLogList = await includeRazaoRevenda(logList, requester);
        
      logList = newLogList
            
      //Cria Paginação
      const novoArray =  await createPagination(logList, limitPerPage);
        
      return [novoArray[page], logCount];

    };

    // Start building the query object.
    var query: any = {};

    if(cdg_revenda !== ''){
      // Start building the query object.
      query = { cdg_revenda };
    };    
        
    const relations = ['cliente'];

    // Filter by cdg_cotrato.
    if (cdg_contrato) {         
        query.cdg_contrato = cdg_contrato 
    };

    // Filter by cdg_cliente.
    if (cdg_cliente) {         
      query.cdg_cliente = cdg_cliente 
    };
  
    // Filter by Acao.
    if (acao.length > 0) {
        if (acao.includes('Todos')) {
          // No need to filter by acao.
        } else {
          const formattedAcao = acao.map((s) => s.toLowerCase());
          query.acao = In(formattedAcao);
        }
    };

    // Filter by Atendente Inspell.
    if(atendente_inspell){
        query.atendente_inspell = atendente_inspell       
    };

    // Filter by Técnico Revenda.
    if(cdg_tecrevenda){
        query.cdg_tecrevenda = cdg_tecrevenda       
    };

    let [logList, logCount] = await getRepository(LogAuditoriaContrato).findAndCount({
        where: query,
        relations,
    });
  
    if (logCount === 0) {
        return {
          error: true,
          message: 'Not Found',
        };
    };
      
    // Filter by date
    if (datainicio && datafinal) {
        const inicial = new Date(datainicio);
        const final = new Date(datafinal);
        logList = logList.filter(current => {
          const datelog= new Date(current.createdAt);
    
          if (datelog>= inicial && datelog<= final) {
            return current;
          }
        });

    };

    // Inclui a razão social da revenda no objeto
    const newLogList = await includeRazaoRevenda(logList, requester);
      
    logList = newLogList
  
    //Cria Paginação
    const novoArray =  await createPagination(logList, limitPerPage);
      
    return [novoArray[page], logList.length];

        
  } catch (error) {
    throw new Error (`${error}`);
        
  }

}