import { getRepository } from 'typeorm';
import { Contrato } from '../../database/entities';
import ICheckContratoResult from '../../lib/helpers/interfaces/CheckContratoResult';

export default async function checkContratoType (contractData:any): Promise<Contrato | ICheckContratoResult > {
    //verifica se o contrato que vai ser criado é multi-unidade e se está sendo criado através de um contrato principal.
   // Multi-unidade só pode ser criado por contrato principal.
    
    
        try {
            

            contractData.contratoid = parseInt(contractData.contratoid);

            const contratoRepository = getRepository(Contrato);

            var contratoPrincipal = await contratoRepository.findOne({ where: { id:contractData.contratoid } });

            if(!contratoPrincipal){
                throw new Error('Não foi possível encontrar o contrato principal!');
            }
            
            if(contratoPrincipal?.tipo === 'multi-unidade'){
            
                return{
                    error:true,
                    msg:'Você precisa selecionar o contrato principal para realizar essa ação!'
                };
                
            };

            return contratoPrincipal;
        
        
        } catch (error) {
            console.log(error);
            throw new Error (error);              
        }; 
    
    
}