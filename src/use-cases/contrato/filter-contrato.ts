import { Contrato } from '../../database/entities';
import IRequester from '../../lib/interfaces/requester';
import { Cliente } from '../../database/entities';
import { getRepository, ILike, In } from 'typeorm';


interface FilterOptions {
  codrevenda?: string;
  status?: string[];
  cliente?: string;
  plano?: string;
  date?:string;
  datainicio?:string;
  datafinal?:string;
}

export default async function filterAtendente(
  body: FilterOptions,
  requester: IRequester,
) {
  if (requester.p.toString() !== '**') { // Verifica se usuário tem a permissão de Atendente Inspell
      return {
        error: true,
        message: 'Você não possui permissãoo para realizar essa operação!',
      };
    };

  try {
    const {codrevenda = '', status = [], cliente = '', plano = '', date='', datafinal='', datainicio =''} = body;


    // When no options are provided, return all contracts for the given revenda.
    if (!status.length && !cliente && !plano && !datafinal && !datainicio) {
      const [contractList, contractCount] = await getRepository(Contrato).findAndCount({
        where: { codrevenda },
        relations: ['cliente'],
      });

      if (contractCount === 0) {
        return {
          error: true,
          message: 'Not Found',
        };
      }

      return [contractList, contractCount];
    };

    // Start building the query object.
    const query: any = { codrevenda };
    const relations = ['cliente'];

    // Filter by cliente
    if (cliente) {
      const formattedCliente = `%${cliente.toUpperCase()}%`;
      const clientes = await getRepository(Cliente).find({
        where: [
          { cnpj: ILike(formattedCliente) },
          { razaosocial: ILike(formattedCliente) },
          { fantasia: ILike(formattedCliente) },
        ],
        relations: ['contratos'],
      });
    
      const filteredClientes = clientes.map((cliente) => {
        const filteredContratos = cliente.contratos.filter((contrato) => {
          const matchPlano = plano ? contrato.plano.toLowerCase() === plano.toLowerCase() : true;
          const matchStatus = status.length ? status.includes('Todos') ? true : status.map((s) => s.toLowerCase()).includes(contrato.status.toLowerCase()) : true;
          return matchPlano && matchStatus;
        });
    
        if (filteredContratos.length > 0) {
          return {
            ...cliente,
            contratos: filteredContratos,
          };
        }
    
        return null;
      }).filter((cliente) => cliente !== null);
    
      if (filteredClientes.length === 0) {
        return {
          error: true,
          message: 'Not Found',
        };
      }
    
      let contractList = filteredClientes.flatMap((cliente) => cliente.contratos.map((contrato) => ({
        ...contrato,
        cliente: {
          ...cliente,
          contratos: undefined,
        },
      })));

      if(date !== "Buscar por Data"){
        const inicial = new Date(datainicio);
        const final = new Date(datafinal);

        if(date === 'Data inicial do contrato'){

          const newContractList = contractList.filter(current =>{
            const dateContract = new Date (current.dataInicio);

            if(dateContract >= inicial && dateContract <= final){
              return current;
            }

          })

          contractList = newContractList

          
        }else if(date === 'Data de vencimento do contrato'){

          const newContractList = contractList.filter(current =>{
            const dateContract = new Date (current.dataInicio);

            if(current.plano === 'anual'){
              dateContract.setFullYear(dateContract.getFullYear() + 1)
              if(dateContract >= inicial && dateContract <= final){
                return current;
              }
              

            }else if(current.plano === "mensal"){
              dateContract.setMonth(dateContract.getMonth() + 1);
              if(dateContract >= inicial && dateContract <= final){
                return current;
              }

            }

          })

          contractList = newContractList        

        }
        
      }
    
      return [contractList, contractList.length];
    };

   
    // Filter by plano.
    if (plano) {
      const formattedPlano = plano.toLowerCase();
      if (formattedPlano !== 'todos') {
        query.plano = formattedPlano;
      }
    }

    // Filter by status.
    if (status.length) {
      if (status.includes('Todos')) {
        // No need to filter by status.
      } else {
        const formattedStatus = status.map((s) => s.toLowerCase());
        query.status = In(formattedStatus);
      }
    }

    let [contractList, contractCount] = await getRepository(Contrato).findAndCount({
      where: query,
      relations,
    });

    if (contractCount === 0) {
      return {
        error: true,
        message: 'Not Found',
      };
    }

    if (date !== "Buscar por Data") {
      const inicial = new Date(datainicio);
      const final = new Date(datafinal);
    
      if (date === 'Data inicial do contrato') {
        contractList = contractList.filter(current => {
          const dateContract = new Date(current.dataInicio);
    
          if (dateContract >= inicial && dateContract <= final) {
            return current;
          }
        });
    
      } else if (date === 'Data de vencimento do contrato') {
        contractList = contractList.filter(current => {
          const dateContract = new Date(current.dataInicio);
    
          if (current.plano === 'anual') {
            dateContract.setFullYear(dateContract.getFullYear() + 1);
            if (dateContract >= inicial && dateContract <= final) {
              return current;
            }
          } else if (current.plano === "mensal") {
            dateContract.setMonth(dateContract.getMonth() + 1);
            if (dateContract >= inicial && dateContract <= final) {
              return current;
            }
          }
        });
      }
    }

   



    return [contractList, contractCount];

  } catch (error) {
    return {
      error: true,
      message: error,
    };
  };
};