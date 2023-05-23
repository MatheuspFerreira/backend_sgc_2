import { format } from "date-fns";
import { getRepository } from "typeorm";
import { Contrato } from "../../database/entities";
import IRequester from "../../lib/interfaces/requester";
import salvarLogAuditoriaContrato from "../log_auditoria/register-log";
import IContractData from "./interfaces/contract-data";

export default async function updateContrato (contractData:IContractData, requester:IRequester) {
    
    // Verifica se o Requester é Atendente Inspell
    if(requester.p[0] !=='**'){
        throw new Error('Você não tem permissão para realizar essa ação!');
    };


    try {
        const formattedContract = `%${contractData.id}%`
        const contracts = await getRepository(Contrato)
        .createQueryBuilder("contrato")
        .leftJoinAndSelect("contrato.contratosSecundarios", "contratosSecundarios")
        .where("LOWER(contrato.id) LIKE LOWER(:formattedContract)", { formattedContract })
        .getMany();




        // Contrato Multi-unidade só pode ter o valor cobrado alterado
        // Os demais dados devem ser alterados, através do contrato principal.
        if((contracts[0].tipo === 'multi-unidade') && contracts[0].status ==='ativo') {

            // Salvar logAuditoria contrato multi-unidade dados antigos
            await salvarLogAuditoriaContrato(
                {
                    id:contracts[0].id, 
                    codrevenda:contracts[0].codrevenda, 
                    codcliente:contracts[0].codcliente
                }, 
                requester, 
                'alterado',
                `Dados antigos: 
                valor cobrado: ${contracts[0].valorCobrado}`
            );

            // Novo valor
            contracts[0].valorCobrado = contractData.valorCobrado;
            
            // Salvar o contrato multi-unidade
            const contratoRepository = getRepository(Contrato);
            await contratoRepository.save(contracts[0]);

            // Salvar logAuditoria contrato multi-unidade novos dados
            await salvarLogAuditoriaContrato(
                {
                    id:contracts[0].id, 
                    codrevenda:contracts[0].codrevenda, 
                    codcliente:contracts[0].codcliente
                }, 
                requester, 
                'alterado',
                `Novos dados: 
                valor cobrado: ${contracts[0].valorCobrado}`
            );

            return;
        };

        // Mudar o cód da revenda
        // Cancelar contrato principal e todos multi-unidades
        // Criar novo contrato principal e novos multi-unidades

        if((contractData.codrevenda !== contracts[0].codrevenda && contractData.codrevenda) && contracts[0].status ==='ativo'){
            
            const contratoRepository = getRepository(Contrato);

            // Cria um novo contrato 
            const newContract =  new Contrato();
            newContract.dataInicio = new Date();
            newContract.sufixo = contracts[0].sufixo;
            newContract.codproduto = contracts[0].codproduto;
            newContract.codrevenda = contractData.codrevenda;
            newContract.campanha = contracts[0].campanha;
            newContract.adminEmail = contracts[0].adminEmail;
            newContract.cliente = contracts[0].cliente;
            newContract.codcliente = contracts[0].codcliente;
            newContract.id_ifitness_web = contracts[0].id_ifitness_web;
            newContract.tipo = contracts[0].tipo;
            newContract.plano = contractData.plano !== '' ? contractData.plano : contracts[0].plano
            newContract.versao = contractData.versao !== '' ? contractData.versao : contracts[0].versao
            newContract.valorCobrado = typeof contractData.valorCobrado === 'number' ? contractData.valorCobrado : contracts[0].valorCobrado;
            
            // Salva novo contrato principal
            await contratoRepository.save(newContract);

            // Salva log do novo contrato principal
            await salvarLogAuditoriaContrato(
                {
                    id:newContract.id, 
                    codrevenda:newContract.codrevenda, 
                    codcliente:newContract.codcliente
                }, 
                requester, 
                'criado',
                `Novos dados: sufixo:${newContract.sufixo}, id-ifitness:${newContract.id_ifitness_web}, plano:${newContract.plano}, versao:${newContract.versao}, valorCobrado:${newContract.valorCobrado}`
            );

            // Salva log do contrato antigo
            await salvarLogAuditoriaContrato(
                {
                    id:contracts[0].id, 
                    codrevenda:contracts[0].codrevenda, 
                    codcliente:contracts[0].codcliente
                }, 
                requester, 
                'cancelado',
                `Dados antigos: sufixo:${contracts[0].sufixo}, id-ifitness:${contracts[0].id_ifitness_web}, plano:${contracts[0].plano}, versao:${contracts[0].versao}, valorCobrado:${contracts[0].valorCobrado}`
            );

            // Cancela o contrato principal e remove sufixo e id_ifitness
            contracts[0].status = 'cancelado';
            contracts[0].id_ifitness_web = null;
            contracts[0].sufixo = null;
            
            // Salvar as alterações do antigo contrato principal           
            await contratoRepository.save(contracts[0]);
            

            for (let i = 0; i < contracts[0].contratosSecundarios.length; i++) {
                
                // Cria um novo contrato Multi-unidade
                const newContractMult =  new Contrato();
                newContractMult.dataInicio = new Date();           
                newContractMult.sufixo = contracts[0].contratosSecundarios[i].sufixo;
                newContractMult.codproduto = contracts[0].contratosSecundarios[i].codproduto;
                newContractMult.codrevenda = contractData.codrevenda;
                newContractMult.campanha = contracts[0].contratosSecundarios[i].campanha;
                newContractMult.adminEmail = contracts[0].contratosSecundarios[i].adminEmail;
                newContractMult.codcliente = contracts[0].contratosSecundarios[i].codcliente;
                newContractMult.cliente = contracts[0].contratosSecundarios[i].cliente;
                newContractMult.id_ifitness_web = contracts[0].contratosSecundarios[i].id_ifitness_web;
                newContractMult.tipo = contracts[0].contratosSecundarios[i].tipo;
                newContractMult.plano = contractData.plano !== '' ? contractData.plano : contracts[0].contratosSecundarios[i].plano
                newContractMult.versao = contractData.versao !== '' ? contractData.versao : contracts[0].contratosSecundarios[i].versao
                newContractMult.valorCobrado = typeof contractData.valorCobrado === 'number' ? contractData.valorCobrado : contracts[0].contratosSecundarios[i].valorCobrado;
                newContractMult.contrato = newContract;
                
                // Salva novo contrato multi-unidade
                await contratoRepository.save(newContractMult);

                // Salva log do novo contrato multi-unidade
                await salvarLogAuditoriaContrato(
                    {
                        id:newContractMult.id, 
                        codrevenda:newContractMult.codrevenda, 
                        codcliente:newContractMult.codcliente
                    }, 
                    requester, 
                    'criado',
                    `Novos dados: sufixo:${newContractMult.sufixo}, id-ifitness:${newContractMult.id_ifitness_web}, plano:${newContractMult.plano}, versao:${newContractMult.versao}, valorCobrado:${newContractMult.valorCobrado}`
                );

                // Salva log do contrato antigo Multi-unidade
                await salvarLogAuditoriaContrato(
                    {
                        id:contracts[0].contratosSecundarios[i].id, 
                        codrevenda:contracts[0].contratosSecundarios[i].codrevenda, 
                        codcliente:contracts[0].contratosSecundarios[i].codcliente
                    }, 
                    requester, 
                    'cancelado',
                    `Dados antigos: sufixo:${contracts[0].contratosSecundarios[i].sufixo}, id-ifitness:${contracts[0].contratosSecundarios[i].id_ifitness_web}, plano:${contracts[0].contratosSecundarios[i].plano}, versao:${contracts[0].contratosSecundarios[i].versao}, valorCobrado:${contracts[0].contratosSecundarios[i].valorCobrado}`
                );

                // Cancela o contrato multi-unidade e remove sufixo e id_ifitness
                contracts[0].contratosSecundarios[i].status = 'cancelado';
                contracts[0].contratosSecundarios[i].id_ifitness_web = null;
                contracts[0].contratosSecundarios[i].sufixo = null;

                // Salva o cancelamento do contrato multi-unidade
                await contratoRepository.save(contracts[0].contratosSecundarios[i]);
             
            };

            return;

        }else if((contractData.codrevenda === contracts[0].codrevenda || !contractData.codrevenda) && contracts[0].status ==='ativo'){
            // Se cód da revenda for igual, vamos alterar somente os demais dados.
            // vamos alterar no contrato principal e em tds multi-unidades
            
            // Salvar logAuditoria contrato principal dados antigos
            await salvarLogAuditoriaContrato(
                {
                    id:contracts[0].id, 
                    codrevenda:contracts[0].codrevenda, 
                    codcliente:contracts[0].codcliente
                }, 
                requester, 
                'alterado',
                `Dados antigos: plano:${contracts[0].plano}, versao:${contracts[0].versao}, valor cobrado: ${contracts[0].valorCobrado}`
            );

            // Alterar o contrato principal
            contracts[0].plano = contractData.plano !== '' ? contractData.plano : contracts[0].plano
            contracts[0].versao = contractData.versao !== '' ? contractData.versao : contracts[0].versao
            contracts[0].valorCobrado = typeof contractData.valorCobrado === 'number' ? contractData.valorCobrado : contracts[0].valorCobrado;
            
            // Salvar o contrato principal
            const contratoRepository = getRepository(Contrato);
            await contratoRepository.save(contracts[0]);

            // Salvar logAuditoria contrato principal novos dados
            await salvarLogAuditoriaContrato(
                {
                    id:contracts[0].id, 
                    codrevenda:contracts[0].codrevenda, 
                    codcliente:contracts[0].codcliente
                }, 
                requester, 
                'alterado',
                `Novos Dados: plano: ${contracts[0].plano}, versao: ${contracts[0].versao}, valor cobrado: ${contracts[0].valorCobrado}`
            );
        
            for (let i = 0; i <contracts[0].contratosSecundarios.length; i++) {
                
                // Salvar logAuditoria Multi-unidades dados antigos
                await salvarLogAuditoriaContrato(
                    {
                        id:contracts[0].contratosSecundarios[i].id, 
                        codrevenda:contracts[0].contratosSecundarios[i].codrevenda, 
                        codcliente:contracts[0].contratosSecundarios[i].codcliente
                    }, 
                    requester, 
                    'alterado',
                    `Dados antigos: plano:${contracts[0].contratosSecundarios[i].plano}, versao:${contracts[0].contratosSecundarios[i].versao},  valor cobrado:${contracts[0].contratosSecundarios[i].valorCobrado}`
                );
                
                contracts[0].contratosSecundarios[i].plano = contractData.plano !== '' ? contractData.plano : contracts[0].contratosSecundarios[i].plano
                contracts[0].contratosSecundarios[i].versao = contractData.versao !== '' ? contractData.versao : contracts[0].contratosSecundarios[i].versao
                contracts[0].contratosSecundarios[i].valorCobrado = typeof contractData.valorCobrado === 'number' ? contractData.valorCobrado : contracts[0].contratosSecundarios[i].valorCobrado;
                
                // Salvar o contrato Multi-unidade
                await contratoRepository.save(contracts[0].contratosSecundarios[i]);

                // Salvar logAuditoria Multi-unidades novos dados
                await salvarLogAuditoriaContrato(
                    {
                        id:contracts[0].contratosSecundarios[i].id, 
                        codrevenda:contracts[0].contratosSecundarios[i].codrevenda, 
                        codcliente:contracts[0].contratosSecundarios[i].codcliente
                    }, 
                    requester, 
                    'alterado',
                    `Novos dados: plano:${contracts[0].contratosSecundarios[i].plano}, versao:${contracts[0].contratosSecundarios[i].versao}, valor cobrado:${contracts[0].contratosSecundarios[i].valorCobrado}`
                );
         
            }

        }else {
            throw new Error('Atenção, só é possível alterar contrato com status Ativo!');
        };

        

    } catch (error) {
        console.log(error)
        return {
            error:true,
            message:error.message
        }
        
    };

    



}