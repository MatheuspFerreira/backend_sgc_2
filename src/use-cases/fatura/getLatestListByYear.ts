import { getRepository, Between } from "typeorm";
import { podeConsultarClientes } from "../../lib/authorizations";
import IRequester from "../../lib/interfaces/requester";
import Faturas from "../../database/entities/faturas.entity";

export default async function getLatestListByYear (year:string, codrevenda:string, requester:IRequester) {

    podeConsultarClientes(requester);

    //Somente o atendente inspell pode consultar faturas de outras revendas
    if(requester.type !== 'atendente'){
        let verify = requester.id !==  parseInt(codrevenda);
        
        if(verify){
            throw new Error('Você não possui permissao para realizar essa ação');
        };
  
    };

  
    try {
        const faturas = await getRepository(Faturas).find({
            where:{
                competencia: Between(
                    `${year}-01-01`,
                    `${year}-12-31`
                ),
                codrevenda:codrevenda
                
            }
        })
        
        return faturas
        
    } catch (error) {
        throw new Error (error);
        
    };

};



