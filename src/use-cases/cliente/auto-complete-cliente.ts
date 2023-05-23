import { getRepository,ILike } from "typeorm";
import { Cliente } from "../../database/entities";
import { podeConsultarClientes } from "../../lib/authorizations";
import IRequester from "../../lib/interfaces/requester";



export default async function AutoCompleteCliente (body:{cliente:string}, requester:IRequester) {

    podeConsultarClientes(requester);

    const { cliente } = body;

    try {
        // Verifica se o requester tem o nível de permissão do Atendente Inspell
        if(requester.p[0] === '**'){
            if (cliente) {
                const formattedCliente = `%${cliente.toUpperCase()}%`;
    
                const clientesFiltrados = await getRepository(Cliente).find({
                    where: [  
                    { 
                        cnpj: ILike(formattedCliente) 
                    },
                    { 
                        razaosocial: ILike(formattedCliente) 
                    },
                    { 
                        fantasia: ILike(formattedCliente) 
                    },
                    ],
                    relations: ['contratos'],
                });
    
                return clientesFiltrados
            }
    
        }
       
        
        const codrevenda = requester.id as number;
      
        if (cliente) {
            const formattedCliente = `%${cliente.toUpperCase()}%`;
    
            const clientesFiltrados = await getRepository(Cliente).find({
                where: [  
                  { 
                    cnpj: ILike(formattedCliente) 
                  },
                  { 
                    razaosocial: ILike(formattedCliente) 
                  },
                  { 
                    fantasia: ILike(formattedCliente) 
                  },
                ],
                relations: ['contratos'],
            });
              
            const clientesFiltradosPelaRevenda = clientesFiltrados.filter((cliente) => {
                return cliente.contratos.some((contrato) => contrato.codrevenda === codrevenda);
            });

            const returnClientesFiltred = clientesFiltradosPelaRevenda.map(current =>{
                delete current.contratos

                return current
                
            })
              
            return returnClientesFiltred;
              
    
        };
    
        
    } catch (error) {
        console.log(error)
        throw new Error(`${error}`);
        
    };

  
};