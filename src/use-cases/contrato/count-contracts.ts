import { getRepository } from 'typeorm';
import { Contrato } from '../../database/entities';
import IRequester from '../../lib/interfaces/requester';

export default async function ContractsCount (requester:IRequester) {

    try {
       if(requester.p[0] === '**'){

            // Obter todos os contratos
            const contratos = await getRepository(Contrato).find();
            
            // Verifica se encotrou o contrato
            if(!contratos){
                throw new Error('Não fui possível buscar o contrato!');
            };

            // Conta a quantidade de contratos pelo status
            const indicadores = {

                totalContratos:contratos.length,
                ativo:0,
                suspenso:0,
                aguardandoCancelamento:0,
                cancelado:0             

            };
        
            for (let i = 0; i < contratos.length; i++) {
        
                if(contratos[i].status === 'ativo'){
                    indicadores.ativo ++;                 
        
                }else if(contratos[i].status === 'suspenso'){
                    indicadores.suspenso ++;
        
                }else if(contratos[i].status === 'aguardando cancelamento'){
                    indicadores.aguardandoCancelamento ++;
        
                }else if(contratos[i].status === 'cancelado'){
                    indicadores.cancelado ++;
        
                };
                              
            };
            
            //retorna a quantidade de contratos por status
            return indicadores;
            
        }else {
            // Define o cód da revenda
            const revenda = requester.id;
            
            const contratos = await getRepository(Contrato).find({
                where:{
                    codrevenda:revenda
                }
            });

            // Verifica se encotrou o contrato
            if(!contratos){
                throw new Error('Não fui possível buscar o contrato!');
            };

            const indicadores = {
                totalContratos:contratos.length,
                ativo:0,
                suspenso:0,
                aguardandoCancelamento:0,
                cancelado:0
            };
        
            for (let i = 0; i < contratos.length; i++) {
        
                if(contratos[i].status === 'ativo'){
                    indicadores.ativo ++;
                    
        
                }else if(contratos[i].status === 'suspenso'){
                    indicadores.suspenso ++;
        
                }else if(contratos[i].status === 'aguardando cancelamento'){
                    indicadores.aguardandoCancelamento ++;
        
                }else if(contratos[i].status === 'cancelado'){
                    indicadores.cancelado ++;
        
                };
                
            };
            
            return indicadores;

        };
        
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
        
    };
   
};