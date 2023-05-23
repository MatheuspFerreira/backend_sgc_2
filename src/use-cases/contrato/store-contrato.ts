import { format } from 'date-fns';
import { NotFound as NotFoundError } from 'http-errors';
import { getConnection, getRepository } from 'typeorm';
import { Contrato, Produto, Cliente, Revenda, Atendente } from '../../database/entities';
import salvarLogAuditoriaContrato from '../log_auditoria/register-log';
import validator from './validators/store-contrato';
import IRequester from '../../lib/interfaces/requester';
import { podeLicenciarClientes } from '../../lib/authorizations';
import CreateMultUnitApi from '../../lib/api/create-mult-unit';
import CreateContractApi from '../../lib/api/create-contract';
import checkContratoType from '../../lib/helpers/check-contratoType';
import ICheckContratoResult from '../../lib/helpers/interfaces/CheckContratoResult';
import storeCliente from '../cliente/store-cliente';



export default async function store(
  contractData: any,// criar type. Type antigo ICreateContract
  requester: IRequester
) {
  
  await validator(contractData);
  podeLicenciarClientes(requester);

  try {

    if( contractData.contratoid){
      var contratoPrincipal = await checkContratoType(contractData) as any
  
      if ('error' in contratoPrincipal) {
        return contratoPrincipal as ICheckContratoResult;
      };

    }
      
    // Verifica se o Cliente já está cadastrado.
    // Se estiver, retorna os dados do cliente, se não estiver cria um novo cliente e retorna os dados.
    const newCliente = await storeCliente({data:contractData}, requester);
    console.log(newCliente.data)

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
    contrato.codrevenda = requester.p.toString() === '**' ? contractData.revenda.id : requester.id; 
    contrato.campanha = contractData.campanha;
    contrato.adminEmail = contractData.adminEmail;
    contrato.cliente = newCliente.data;
    contrato.id_ifitness_web = 0;
    contrato.tipo = contractData.tipo;

    if(contractData.contratoid){
      contrato.plano = contratoPrincipal.plano;
      contrato.versao = contratoPrincipal.versao;
      contrato.valorCobrado = contratoPrincipal.valorCobrado;

    }else {
      contrato.plano = contractData.plano;
      contrato.versao = contractData.versao;
      contrato.valorCobrado = contractData.valorCobrado;

    };


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

    if(contractData.tipo ==='multi-unidade'){
      var createMultInExternalApi = await CreateMultUnitApi({
        nome_fantasia: saveContract.cliente.fantasia,
        razao_social: saveContract.cliente.razaosocial,
        ativo: saveContract.status,
        cnpj_cpf:saveContract.cliente.cnpj,
        prefix: saveContract.sufixo
      })

      if(createMultInExternalApi.error || createMultInExternalApi.result !== true){
        return createMultInExternalApi;           
      };
          
      contrato.id_ifitness_web = createMultInExternalApi.data.id_unidade;

    }else {
      
      const revendaId = requester.p.toString() === '**' ? contractData.revenda.id : requester.id;
      const revenda = await getRepository(Revenda).findOne({
        codrevenda: revendaId
      });

      var createInExternalApi= await CreateContractApi({
        nome: revenda.razaosocial,
        prefixo: saveContract.sufixo,
        id_revenda: revenda.codrevenda,
        cnpj_revenda: revenda.cnpj,
        razao_social_revenda: revenda.razaosocial,
        unidades: [{
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
        }]
      }
      
      ) as any
    
      if(createInExternalApi.error || createInExternalApi.result !== true){
        return createInExternalApi;           
      };
      contrato.id_ifitness_web = createInExternalApi.cod_contrato;

    }       
         
    saveContract.status = 'ativo';
    const newContract = await getConnection().manager.save(contrato, { reload: true });
     
    // Salva a ação no log
    salvarLogAuditoriaContrato(contrato, requester, "criado");
   
    return contractData.tipo === 'multi-unidade' ? [newContract, createMultInExternalApi] : newContract
 
  } catch (error) {
  
    return {
      error:true,
      message:error
    };
         
  };
     
};
