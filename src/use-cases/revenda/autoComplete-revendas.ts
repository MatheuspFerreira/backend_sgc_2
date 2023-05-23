import { getRepository,ILike } from "typeorm";
import { Revenda } from "../../database/entities";
import IRequester from "../../lib/interfaces/requester";



export default async function AutoCompleteRevenda (body:{revenda:string}, requester:IRequester) {

    // Verifica se o requester tem o nível de permissão do Atendente Inspell
    if(requester.p[0] !== '**'){
        throw new Error('Você não tem permissão para realizar essa ação!')
    };

    let { revenda } = body;

    try {
        
        if(requester.p[0] === '**'){
            if (revenda) {

                revenda = `%${revenda.toUpperCase()}%`;
    
                const revendasFiltrados = await getRepository(Revenda).find({
                    where: [ 
                        { 
                            cnpj: ILike(revenda) 
                        }, 
                        { 
                            razaosocial: ILike(revenda) 
                        },
                        { 
                            fantasia: ILike(revenda) 
                        },
                        { 
                            codrevenda: ILike(revenda) 
                        },
                    ],
                    select: [ 'codrevenda', 'razaosocial']
                    
                });
    
                return revendasFiltrados
            }
    
        };
        
    } catch (error) {
        console.log(error)
        throw new Error(`${error}`);
        
    };

  
};