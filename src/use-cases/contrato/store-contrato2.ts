import { format } from 'date-fns';
import { NotFound as NotFoundError } from 'http-errors';
import { Any, getConnection, getRepository } from 'typeorm';
import { Contrato, Produto, Cliente, Revenda, Atendente } from '../../database/entities';
import salvarLogAuditoriaContrato from '../log_auditoria/register-log';
import validator from './validators/store-contrato';
//import ICreateContract from './interfaces/store-contrato';
import IRequester from '../../lib/interfaces/requester';
import { podeLicenciarClientes } from '../../lib/authorizations';
import hasActiveContracts from './business-rules/has-active-contracts';
import Status from '../../lib/types/Status';
import CreateMultUnitApi from '../../lib/api/create-mult-unit';
import CreateContractApi from '../../lib/api/create-contract';


export default async function store(
  contractData: any,// criar type. Type antigo ICreateContract
  requester: IRequester
) {
  
  await validator(contractData);
  podeLicenciarClientes(requester);

  //verifica se o contrato que vai ser criado é multi-unidade e se está sendo criado através de um contrato principal
  // Multi-unidade só pode ser criado por contrato principal
  if(contractData.contratoid){
    try {
      contractData.contratoid = parseInt(contractData.contratoid)
      const contratoRepository = getRepository(Contrato);
      var contratoPrincipal = await contratoRepository.findOne({ where: { id:contractData.contratoid } });

      if(!contratoPrincipal){
        throw new Error('Não foi possível encontrar o contrato principal!')
      }
     
      if(contratoPrincipal?.tipo === 'multi-unidade'){
      
        return{
          error:true,
          msg:'Você precisa selecionar o contrato principal para realizar essa ação!'
        }
      }
      
      
    } catch (error) {
      console.log(error)
      
      
    }
    
  };
 
  if(requester.p.toString() === '**'){ // Verifica se o Requester tem a permissão de Atendente Inspell

    if(contractData.tipo ==='multi-unidade'){
      try {

        //Verifica se o cliente já está cadastrado
        const cliente =  await getRepository(Cliente).findOne({
          order: {
            fantasia: 'ASC',
          },
          where: {
            codcliente: contractData.codcliente,
          },
          
        })
      
        // Se o cliente não existir cria um novo.
        if(cliente.cnpj !== contractData.cnpj || !cliente){

          //Cria um novo cliente
          const newCliente = new Cliente();
          newCliente.razaosocial= contractData.razaosocial;
          newCliente.fantasia = contractData.fantasia;
          newCliente.cnpj = contractData.cnpj;
          newCliente.endereco =  contractData.endereco
          newCliente.bairro = contractData.bairro
          newCliente.cidade = contractData.cidade
          newCliente.uf = contractData.uf
          newCliente.cep = contractData.cep
          newCliente.tel1 = contractData.tel1
          newCliente.tel2 = contractData.tel2 
          newCliente.email = contractData.email
          newCliente.inscricaoestadual = contractData.inscricaoestadual
          newCliente.inscricaomunicipal = contractData.inscricaomunicipal
          const savedCliente = await getRepository(Cliente).save(newCliente);

          if (!savedCliente) {
            return {
              error:true,
              message:'Erro ao salvar o cliente'
            };
          };

          // Verifica se o código do produto é válido
          const produto =  await getRepository(Produto).findOne({ codproduto: contractData.codproduto });

          if (!produto) {
            throw new NotFoundError('Produto não encontrado');
          };

          // Cria um novo contrato 
          const contrato =  new Contrato();
          contrato.dataInicio = format(
              new Date(contractData.dataInicio),
              'yyyy-MM-dd'
          ) as unknown as Date;
          contrato.sufixo = contractData.sufixo;
          contrato.codproduto = contractData.codproduto;
          contrato.codrevenda = contractData.revenda.id;
          contrato.campanha = contractData.campanha;
          contrato.adminEmail = contractData.adminEmail;
          contrato.cliente = newCliente;
          contrato.id_ifitness_web = 0;
          contrato.tipo = contractData.tipo;
          contrato.plano = contratoPrincipal.plano;
          contrato.versao = contratoPrincipal.versao;
          contrato.valorCobrado = contratoPrincipal.valorCobrado;
          
          
        

          if (contractData.contratoid) {
            contrato.contratosSecundarios = [contractData.contratoid]
            contrato.contrato = await getRepository(Contrato).findOne({
              id: contractData.contratoid,
            });
    
          };
    
          const saveContract = await getConnection().manager.save(contrato, { reload: true });
          if(!saveContract){ 
            return {
              error:true,
              message:'Erro ao criar o contrato'
            };
              
          };

         // Integração IFitness

          if(saveContract.status === 'ativo'){
            saveContract.status = 'T' as any;
    
          };

          const createMultInExternalApi = await CreateMultUnitApi({
            nome_fantasia: saveContract.cliente.fantasia,
            razao_social: saveContract.cliente.razaosocial,
            ativo: saveContract.status,
            cnpj_cpf:saveContract.cliente.cnpj,
            prefix: saveContract.sufixo
          }) 

          

          if(createMultInExternalApi.error || createMultInExternalApi.result !== true){
            return createMultInExternalApi;
            
          };

          
         
          saveContract.status = 'ativo';
          contrato.id_ifitness_web = createMultInExternalApi.data.id_unidade;
          const newContract = await getConnection().manager.save(contrato, { reload: true });
     
          // Salva a ação no log
          salvarLogAuditoriaContrato(contrato,requester,"criado");
   
          return [newContract,createMultInExternalApi];
        

        }else {

          const cliente =  await getRepository(Cliente).findOne({
            order: {
              fantasia: 'ASC',
            },
            where: {
              codcliente: contractData.codcliente,
            },
            relations: ['contratos', 'contratos.contrato'],
          })
    
          if (!cliente) {
            throw new NotFoundError('Cliente não encontrado');
          };
          
          const produto =  await getRepository(Produto).findOne({ codproduto: contractData.codproduto })
      
          if (!produto) {
            throw new NotFoundError('Produto não encontrado');
          };

          const contrato =  new Contrato();
          contrato.dataInicio = format(
              new Date(contractData.dataInicio),
              'yyyy-MM-dd'
          ) as unknown as Date;
          contrato.sufixo = contractData.sufixo;
          contrato.codproduto = contractData.codproduto;
          contrato.codrevenda = contractData.revenda.id;
          contrato.campanha = contractData.campanha;
          contrato.adminEmail = contractData.adminEmail;
          contrato.cliente = cliente;
          contrato.id_ifitness_web = 0;
          contrato.tipo = contractData.tipo;
          contrato.plano = contratoPrincipal.plano;
          contrato.versao = contratoPrincipal.versao;
          contrato.valorCobrado = contratoPrincipal.valorCobrado;
          
        
          
       
          if (contractData.contratoid) {
            contrato.contratosSecundarios = [contractData.contratoid]
            contrato.contrato = await getRepository(Contrato).findOne({
              id: contractData.contratoid,
            });
    
          };
  
          const saveContract = await getConnection().manager.save(contrato, { reload: true });
          if(!saveContract){ 
            return {
              error:true,
              message:'Erro ao criar o contrato'
            };             
          }; 

          // Integração IFitness

          if(saveContract.status === 'ativo'){
            saveContract.status = 'T' as any;
    
          };

          const createMultInExternalApi = await CreateMultUnitApi({
            nome_fantasia: saveContract.cliente.fantasia,
            razao_social: saveContract.cliente.razaosocial,
            ativo: saveContract.status,
            cnpj_cpf:saveContract.cliente.cnpj,
            prefix: saveContract.sufixo
          }) 

          if(createMultInExternalApi.error || createMultInExternalApi.result !== true){
            return createMultInExternalApi;
            
          };
         
          saveContract.status = 'ativo';
          contrato.id_ifitness_web = createMultInExternalApi.data.id_unidade;
          const newContract = await getConnection().manager.save(contrato, { reload: true });
     
          // Salva a ação no log
          salvarLogAuditoriaContrato(contrato,requester,"criado");
   
          return [newContract,createMultInExternalApi];

          //return saveContract

        };       
      
      } catch (error) {
  
        return {
          error:true,
          message:error
        };  
      };

      
    }else {
      try {
          //se não for Multi-unidade
          
          // @todo: validar cliente, produto e revenda
          // Cliente: Checar se existe e não possui contrato ativo
          // Produto: Checar se existe
          // Revenda: Checar se existe
        const cliente =  await getRepository(Cliente).findOne({
          order: {
            fantasia: 'ASC',
          },
          where: {
            codcliente: contractData.codcliente,
          },
          relations: ['contratos', 'contratos.contrato'],
        })
  
      const produto =  await getRepository(Produto).findOne({ codproduto: contractData.codproduto })
  
      if (!cliente) {
          throw new NotFoundError('Cliente não encontrado');
        };
  
      if (!produto) {
        throw new NotFoundError('Produto não encontrado');
      };
        
      const revenda = await getRepository(Revenda).findOne({
         codrevenda: contractData.revenda.id
  
        });
  
        const contrato =  new Contrato();
        contrato.dataInicio = format(
            new Date(contractData.dataInicio),
            'yyyy-MM-dd'
        ) as unknown as Date;
        contrato.sufixo = contractData.sufixo;
        contrato.codproduto = contractData.codproduto;
        contrato.codrevenda = contractData.revenda.id;
        contrato.versao = contractData.versao;
        contrato.campanha = contractData.campanha;
        contrato.adminEmail = contractData.adminEmail;
        contrato.cliente = cliente;
        contrato.id_ifitness_web = 0;
        contrato.plano = contractData.plano.toLowerCase();
        contrato.tipo = contractData.tipo;
        contrato.valorCobrado = contractData.valorCobrado
        
     
        if (contractData.contratoid) {
          contrato.contratosSecundarios = [contractData.contratoid]
          contrato.contrato = await getRepository(Contrato).findOne({
            id: contractData.contratoid,
          });
  
        };
  
        const saveContract = await getConnection().manager.save(contrato, { reload: true });
          if(!saveContract){ 
            return {
              error:true,
              message:'Erro ao criar o contrato'
            };
            
          };
          
          if(saveContract.status === 'ativo'){
            saveContract.status = 'T' as any;
    
          };
          //console.log(saveContract.cliente.razaosocial)
          //console.log(saveContract.cliente)
          
        const createInExternalApi= await CreateContractApi(
          {
            nome: revenda.razaosocial,
            prefixo: saveContract.sufixo,
            id_revenda: revenda.codrevenda,
            cnpj_revenda: revenda.cnpj,
            razao_social_revenda: revenda.razaosocial,
            unidades: [
              {
                nome: saveContract.cliente.razaosocial,
                nome_fantasia: saveContract.cliente.fantasia,
                razao_social: saveContract.cliente.razaosocial,
                telefone_comercial: '',
                endereco: saveContract.cliente.endereco,
                numero: '',// não tem no cadastro
                complemento: '',// não tem no cadastro
                bairro: saveContract.cliente.bairro,
                cidade: saveContract.cliente.cidade,
                uf: saveContract.cliente.uf,
                ativo: saveContract.status,
                responsavel1: saveContract.cliente.razaosocial,
                cnpj_cpf:saveContract.cliente.cnpj
              }
            ]
          }
    
        ) as any
  
        //console.log(createInExternalApi)
        if(createInExternalApi.error || createInExternalApi.result !== true){
          return createInExternalApi;
          
        };
       
        saveContract.status = 'ativo';
        contrato.id_ifitness_web = createInExternalApi.cod_contrato;
        const newContract = await getConnection().manager.save(contrato, { reload: true });
        
        // Salva a ação no log
        salvarLogAuditoriaContrato(contrato,requester,"criado");
   
        return newContract;
      
      } catch (error) {
  
        return {
          error:true,
          message:error
        };  
      };
    }

   
  };

  if(contractData.tipo ==='multi-unidade'){ // Se for Revenda ou TecRevenda
    try {

      const cliente =  await getRepository(Cliente).findOne({
        order: {
          fantasia: 'ASC',
        },
        where: {
          codcliente: contractData.codcliente,
        },
        
      })

      if(cliente.cnpj !== contractData.cnpj || !cliente){

        //Cria um novo cliente
        const newCliente = new Cliente();
        newCliente.razaosocial= contractData.razaosocial;
        newCliente.fantasia = contractData.fantasia;
        newCliente.cnpj = contractData.cnpj;
        newCliente.endereco =  contractData.endereco
        newCliente.bairro = contractData.bairro
        newCliente.cidade = contractData.cidade
        newCliente.uf = contractData.uf
        newCliente.cep = contractData.cep
        newCliente.tel1 = contractData.tel1
        newCliente.tel2 = contractData.tel2 
        newCliente.email = contractData.email
        newCliente.inscricaoestadual = contractData.inscricaoestadual
        newCliente.inscricaomunicipal = contractData.inscricaomunicipal
        const savedCliente = await getRepository(Cliente).save(newCliente);

        if (!savedCliente) {
          return {
            error:true,
            message:'Erro ao salvar o cliente'
          };
        };

        // Verifica se o código do produto é válido
        const produto =  await getRepository(Produto).findOne({ codproduto: contractData.codproduto });

        if (!produto) {
          throw new NotFoundError('Produto não encontrado');
        };


        // Cria um novo contrato 
        const contrato =  new Contrato();
        contrato.dataInicio = format(
            new Date(contractData.dataInicio),
            'yyyy-MM-dd'
        ) as unknown as Date;
        contrato.sufixo = contractData.sufixo;
        contrato.codproduto = contractData.codproduto;
        contrato.codrevenda = requester.id;
        contrato.campanha = contractData.campanha;
        contrato.adminEmail = contractData.adminEmail;
        contrato.cliente = newCliente;
        contrato.id_ifitness_web = 0;      
        contrato.tipo = contractData.tipo;
        contrato.plano = contratoPrincipal.plano;
        contrato.versao = contratoPrincipal.versao;
        contrato.valorCobrado = contratoPrincipal.valorCobrado;
    
        
        //console.log(contrato)

        if (contractData.contratoid) {
          contrato.contratosSecundarios = [contractData.contratoid]
          contrato.contrato = await getRepository(Contrato).findOne({
            id: contractData.contratoid,
          });
  
        };
  
        const saveContract = await getConnection().manager.save(contrato, { reload: true });
        if(!saveContract){ 
          return {
            error:true,
            message:'Erro ao criar o contrato'
          };
            
        };

        // Integração IFitness

          if(saveContract.status === 'ativo'){
            saveContract.status = 'T' as any;
    
          };

          const createMultInExternalApi = await CreateMultUnitApi({
            nome_fantasia: saveContract.cliente.fantasia,
            razao_social: saveContract.cliente.razaosocial,
            ativo: saveContract.status,
            cnpj_cpf:saveContract.cliente.cnpj,
            prefix: saveContract.sufixo
          }) 

          if(createMultInExternalApi.error || createMultInExternalApi.result !== true){
            return createMultInExternalApi;
            
          };
         
        saveContract.status = 'ativo';
        contrato.id_ifitness_web = createMultInExternalApi.data.id_unidade;
        const newContract = await getConnection().manager.save(contrato, { reload: true });
          
        // Salva a ação no log
        salvarLogAuditoriaContrato(contrato,requester,"criado");
          
        return newContract;
 
        
        
      

      }else {

        const cliente =  await getRepository(Cliente).findOne({
          order: {
            fantasia: 'ASC',
          },
          where: {
            codcliente: contractData.codcliente,
          },
          relations: ['contratos', 'contratos.contrato'],
        })
  
        if (!cliente) {
          throw new NotFoundError('Cliente não encontrado');
        };
        
        const produto =  await getRepository(Produto).findOne({ codproduto: contractData.codproduto })
    
        if (!produto) {
          throw new NotFoundError('Produto não encontrado');
        };

        //console.log(requester)

        const contrato =  new Contrato();
        contrato.dataInicio = format(
            new Date(contractData.dataInicio),
            'yyyy-MM-dd'
        ) as unknown as Date;
        contrato.sufixo = contractData.sufixo;
        contrato.codproduto = contractData.codproduto;
        contrato.codrevenda = requester.id;
        contrato.campanha = contractData.campanha;
        contrato.adminEmail = contractData.adminEmail;
        contrato.cliente = cliente;
        contrato.id_ifitness_web = 0;
        contrato.tipo = contractData.tipo;
        contrato.plano = contratoPrincipal.plano;
        contrato.versao = contratoPrincipal.versao;
        contrato.valorCobrado = contratoPrincipal.valorCobrado;

        
        
        
        
     
        if (contractData.contratoid) {
          contrato.contratosSecundarios = [contractData.contratoid]
          contrato.contrato = await getRepository(Contrato).findOne({
            id: contractData.contratoid,
          });
  
        };

        const saveContract = await getConnection().manager.save(contrato, { reload: true });
        if(!saveContract){ 
          return {
            error:true,
            message:'Erro ao criar o contrato'
          };             
        }; 




        // Integração IFitness

          if(saveContract.status === 'ativo'){
            saveContract.status = 'T' as any;
    
          };

          const createMultInExternalApi = await CreateMultUnitApi({
            nome_fantasia: saveContract.cliente.fantasia,
            razao_social: saveContract.cliente.razaosocial,
            ativo: saveContract.status,
            cnpj_cpf:saveContract.cliente.cnpj,
            prefix: saveContract.sufixo
          }) 

          if(createMultInExternalApi.error || createMultInExternalApi.result !== true){
            return createMultInExternalApi;
            
          };
         
          saveContract.status = 'ativo';
          contrato.id_ifitness_web = createMultInExternalApi.data.id_unidade;
          const newContract = await getConnection().manager.save(contrato, { reload: true });
          // Salva a ação no log
          salvarLogAuditoriaContrato(contrato,requester,"criado");
     
          return newContract;

        

      };       
    
    } catch (error) {

      return {
        error:true,
        message:error
      };  
    };
   
  }else {

    //se não for Multi-unidade

    // @todo: validar cliente, produto e revenda
    // Cliente: Checar se existe e não possui contrato ativo
    // Produto: Checar se existe
    // Revenda: Checar se existe

    try {

      const [cliente, produto] = await Promise.all([
        getRepository(Cliente).findOne({
          order: {
            fantasia: 'ASC',
          },
          where: {
            codcliente: contractData.codcliente,
          },
          relations: ['contratos', 'contratos.contrato'],
        }),
        getRepository(Produto).findOne({ codproduto: contractData.codproduto }),
        
      ]);
      
      await hasActiveContracts(cliente, requester.id);
    
        if (!cliente) {
          throw new NotFoundError('Cliente não encontrado');
        }
    
        if (!produto) {
          throw new NotFoundError('Produto não encontrado');
        }
    
      const contrato = new Contrato();
      contrato.dataInicio = format(
        new Date(contractData.dataInicio),
        'yyyy-MM-dd'
      ) as unknown as Date;
      contrato.sufixo = contractData.sufixo;
      contrato.codproduto = contractData.codproduto;
      contrato.codrevenda = requester.id;
      contrato.versao = contractData.versao;
      contrato.campanha = contractData.campanha;
      contrato.adminEmail = contractData.adminEmail;
      contrato.cliente = cliente;
      contrato.id_ifitness_web = 0;
      contrato.plano = contractData.plano.toLowerCase();
      contrato.tipo = contractData.tipo
      contrato.valorCobrado = contractData.valorCobrado
        
      
      
      if (contractData.contratoid) {
        contrato.contratosSecundarios = [contractData.contratoid]
        contrato.contrato = await getRepository(Contrato).findOne({
          id: contractData.contratoid,
        });
      }

      const saveContract = await getConnection().manager.save(contrato, { reload: true });
        if(!saveContract){ 
          return {
            error:true,
            message:'Erro ao criar o contrato'
          };
          
        };
      
        if(saveContract.status === 'ativo'){
          saveContract.status = 'T' as Status;

        }
        const revenda = await getRepository(Revenda).findOne({
          codrevenda: requester.id
   
         });


      const createInExternalApi= await CreateContractApi(
        {
          nome: revenda.razaosocial,
          prefixo: saveContract.sufixo,
          id_revenda: revenda.codrevenda,
          cnpj_revenda: revenda.cnpj,
          razao_social_revenda: revenda.razaosocial,
          unidades: [
            {
              nome: saveContract.cliente.razaosocial,
              nome_fantasia: saveContract.cliente.fantasia,
              razao_social: saveContract.cliente.razaosocial,
              telefone_comercial: '',
              endereco: saveContract.cliente.endereco,
              numero: '',// não tem no cadastro
              complemento: '',// não tem no cadastro
              bairro: saveContract.cliente.bairro,
              cidade: saveContract.cliente.cidade,
              uf: saveContract.cliente.uf,
              ativo: saveContract.status,
              responsavel1: saveContract.cliente.razaosocial,
              cnpj_cpf:saveContract.cliente.cnpj
            }
          ]
        }

      ) as any

      //console.log(createInExternalApi.result, createInExternalApi.msg)
      if(createInExternalApi.error || createInExternalApi.result !== true){
        //console.log(createInExternalApi)
        return createInExternalApi;
        
      };

      saveContract.status = 'ativo';
      contrato.id_ifitness_web = createInExternalApi.cod_contrato;
      const newContract = await getConnection().manager.save(contrato, { reload: true });
      // Salva a ação no log
      salvarLogAuditoriaContrato(contrato,requester,"criado");
      

      return newContract;

    } catch (error) {
      console.log(error)

      return {
        error:true,
        message:error
      };  
      
    }
    
  };
  
};
