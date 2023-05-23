import { Contrato } from '../../database/entities';
import IRequester from '../../lib/interfaces/requester';
import { Cliente } from '../../database/entities';
import { getRepository, ILike, In } from 'typeorm';
import getAllRevendas from '../revenda/getAll-revenda';
import IFilterOptions from './interfaces/filter-options';
import { podeConsultarClientes } from '../../lib/authorizations';


export default async function filterAtendente(
  body: IFilterOptions,
  requester: IRequester,
  
) {

  podeConsultarClientes(requester);
  
  if (requester.p.toString() === '**' ) { // Verifica se usuário tem a permissão de Atendente Inspell
    

    try {
      const {
        codrevenda = '', 
        status = [], 
        cliente = '', 
        plano = '', 
        date='', 
        datafinal='', 
        datainicio ='',
        page = 0,
        limitPerPage = 25
      } = body;
  
      
      // When no options are provided, return all contracts for the given revenda.
      if (!status.length && !cliente && !plano && !datafinal && !datainicio && codrevenda) {
       
        let [contractList, contractCount] = await getRepository(Contrato).findAndCount({
          where: { codrevenda },
          relations: ['cliente'],
        });
  
        if (contractCount === 0) {
          return {
            error: true,
            message: 'Not Found',
          };
        }
  
        if(contractList.length !== 0){
          const revendas = await getAllRevendas(requester);
          for (let i = 0; i < revendas.revenda.length; i++) {
    
            const newContractList = contractList.map((current, index)=>{
              if(current.codrevenda === revendas.revenda[i].codrevenda){
                const newObj = {...current, razaoSocialRevenda: revendas.revenda[i].razaosocial};
                return newObj;
              } else {
                return current;
              }
            });
    
            contractList = newContractList
            
          }    
    
        }

        let novoArray:any= [];
        let i = 0;
        const novoContrato:any = []
        contractList.map((current:any) => {
            if(!current.length) {
                novoContrato.push(current)
                

            }else if(current.length > 0) {
                for (let i = 0; i < current.length; i++) {
                    novoContrato.push(current[i])
                     
                }
               
            }
            return novoContrato
        })
        while (i < novoContrato.length) {
          novoArray.push(novoContrato.slice(i, i + limitPerPage));
          i += limitPerPage;
        }
        

        
  
        return [novoArray[page], contractCount];
      };
      
      // Start building the query object.
      var query: any = {};

      if(codrevenda !== ''){
        // Start building the query object.
        query = { codrevenda };

      };    
      const relations = ['cliente'];
  
      // Filter by cliente
      if (cliente) {
        const formattedCliente = `%${cliente.toUpperCase()}%`;
        const clientes = await getRepository(Cliente).find({
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

        const filteredClientes = clientes.map((cliente) => {
          const filteredContratos = cliente.contratos.filter((contrato) => {
            const matchPlano = plano ? contrato.plano.toLowerCase() === plano.toLowerCase() : true;
            const matchStatus = status.length ? status.includes('Todos') ? true : status.map((s) => s.toLowerCase()).includes(contrato.status.toLowerCase()) : true;
            
            return (
              codrevenda === '' 
              ? 
              matchPlano && matchStatus 
              : 
              matchPlano && matchStatus && contrato.codrevenda  === parseInt(codrevenda)
            );
            
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
  
        if(contractList.length !== 0){
          const revendas = await getAllRevendas(requester);
          for (let i = 0; i < revendas.revenda.length; i++) {
    
            const newContractList = contractList.map((current, index)=>{
              if(current.codrevenda === revendas.revenda[i].codrevenda){
                const newObj = {...current, razaoSocialRevenda: revendas.revenda[i].razaosocial};
                return newObj;
              } else {
                return current;
              }
            });
    
            contractList = newContractList
            
          }    
    
        }

        let novoArray:any= [];
        let i = 0;
        const novoContrato:any = []
        contractList.map((current:any) => {
            if(!current.length) {
                novoContrato.push(current)
                

            }else if(current.length > 0) {
                for (let i = 0; i < current.length; i++) {
                    novoContrato.push(current[i])
                     
                }
               
            }
            return novoContrato
        })
        while (i < novoContrato.length) {
          novoArray.push(novoContrato.slice(i, i + limitPerPage));
          i += limitPerPage;
        }
        
        
        
  
        return [novoArray[page], contractList.length];

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
  
  
      if(contractList.length !== 0){
        const revendas = await getAllRevendas(requester);
        for (let i = 0; i < revendas.revenda.length; i++) {
  
          const newContractList = contractList.map((current, index)=>{
            if(current.codrevenda === revendas.revenda[i].codrevenda){
              const newObj = {...current, razaoSocialRevenda: revendas.revenda[i].razaosocial};
              return newObj;
            } else {
              return current;
            }
          });
  
          contractList = newContractList
          
        }    
  
      }

      let novoArray:any= [];
        let i = 0;
        const novoContrato:any = []
        contractList.map((current:any) => {
            if(!current.length) {
                novoContrato.push(current)
                

            }else if(current.length > 0) {
                for (let i = 0; i < current.length; i++) {
                    novoContrato.push(current[i])
                     
                }
               
            }
            return novoContrato
        })
        while (i < novoContrato.length) {
          novoArray.push(novoContrato.slice(i, i + limitPerPage));
          i += limitPerPage;
        }
              
  
      return [novoArray[page], contractCount];
           
  
    } catch (error) {
      return {
        error: true,
        message: error,
      };
    };
    
      
  }else {
    try {

      let {codrevenda = requester.id , status = [], cliente = '', plano = '', date='', datafinal='', datainicio ='', limitPerPage = 25 , page = 0} = body;
  
      // When no options are provided, return all contracts for the given revenda.
      if (!status.length && !cliente && !plano && !datafinal && !datainicio && codrevenda) {
        let [contractList, contractCount] = await getRepository(Contrato).findAndCount({
          where: { codrevenda },
          relations: ['cliente'],
        });
  
        if (contractCount === 0) {
          return {
            error: true,
            message: 'Not Found',
          };
        }

        
          let novoArray:any= [];
          let i = 0;
          const novoContrato:any = []
          contractList.map((current:any) => {
              if(!current.length) {
                  novoContrato.push(current)
                  

              }else if(current.length > 0) {
                  for (let i = 0; i < current.length; i++) {
                      novoContrato.push(current[i])
                      
                  }
                
              }
              return novoContrato
          })
          while (i < novoContrato.length) {
            novoArray.push(novoContrato.slice(i, i + limitPerPage));
            i += limitPerPage;
          }
        
  
        return [novoArray[page], contractCount];

      };
  
      // Start building the query object.
      codrevenda = requester.id as any;
      const query: any = { codrevenda };
      const relations = ['cliente'];
  
      // Filter by cliente
      if (cliente) {
        const formattedCliente = `%${cliente.toUpperCase()}%`;
        const clientes = await getRepository(Cliente).find({
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
  
  
        const filteredClientes = clientes.map((cliente) => {
          const filteredContratos = cliente.contratos.filter((contrato) => {
            const matchPlano = plano ? contrato.plano.toLowerCase() === plano.toLowerCase() : true;
            const matchStatus = status.length ? status.includes('Todos') ? true : status.map((s) => s.toLowerCase()).includes(contrato.status.toLowerCase()) : true;
            
            return (
              codrevenda !== '' 
              ?
              matchPlano && matchStatus && contrato.codrevenda  === codrevenda
              : 
              null
            );
            
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
        // Cria Paginação
        let novoArray:any= [];
        let i = 0;
        const novoContrato:any = []
        contractList.map((current:any) => {
          if(!current.length) {
            novoContrato.push(current)
                

          }else if(current.length > 0) {
            for (let i = 0; i < current.length; i++) {
              novoContrato.push(current[i])
                    
            }
              
          }
          return 
          
        })
        while (i < novoContrato.length) {
          novoArray.push(novoContrato.slice(i, i + limitPerPage));
          i += limitPerPage;
        }

        return [novoArray[page], contractList.length];
       
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
  
      // Cria Paginação
      let novoArray:any= [];
      let i = 0;
      const novoContrato:any = []
      contractList.map((current:any) => {
        if(!current.length) {
          novoContrato.push(current)
                

        }else if(current.length > 0) {
          for (let i = 0; i < current.length; i++) {
            novoContrato.push(current[i])
                    
          }
              
          }
          return novoContrato

        })
        while (i < novoContrato.length) {
          novoArray.push(novoContrato.slice(i, i + limitPerPage));
          i += limitPerPage;

        };
      

      return [novoArray[page], contractCount];
  
    } catch (error) {
      console.log(error)
      return {
        error: true,
        message: error,
      };
    };

  };

  
};