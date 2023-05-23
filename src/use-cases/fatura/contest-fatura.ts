import { getRepository } from "typeorm";
import IRequester from "../../lib/interfaces/requester";
import Faturas from "../../database/entities/faturas.entity";
import { podeLicenciarClientes } from "../../lib/authorizations";
import getAllByDate from "./getAllByDate";
import FaturaItens from "../../database/entities/fatura-itens.entity";
import { Revenda } from "../../database/entities";
import sendEmail from "../../lib/nodeMailer/sendEmail";

export default async function contestFatura (cdgFatura:string, revenda:string, motivo:string, requester:IRequester){
 
    podeLicenciarClientes(requester);
    // Falta travar a revenda usando o requester, e colocar uma condição para revenda inspell

    let codrevenda = requester.id;

    if(requester.p[0].toString() === '**'){
        codrevenda = parseInt(revenda);
    };
    

   try {
        const faturasRepository = getRepository(Faturas);

        const fatura = await faturasRepository.findOne({
            where:{
                id:cdgFatura,
                codrevenda:codrevenda
            }
        })


        if(!fatura || fatura === undefined){
            console.log('teste do erro')
            throw new Error ('Fatura não encontrada!')
        };


        fatura.status = 'aguardando contestação';
        //console.log(fatura)

       
        const faturasItensRepository = getRepository(FaturaItens);
        const faturasItens = await getAllByDate(fatura.competencia.toString(), revenda, requester);

        if(faturasItens.length === 0){
            return;

        }

        for (let i = 0; i < faturasItens.length; i++) {
            faturasItens[i].status = 'aguardando contestação';
                       
        }

        const faturaSaved = await faturasRepository.save(fatura);
        const faturaItensSaved = await faturasItensRepository.save(faturasItens);

        
        
        if(faturaItensSaved && faturaSaved){

           // const email = await sendEmail(`${codrevenda}`, motivo, fatura.competencia.toString())
            //console.log(email)

        }
       
        
        return 
        

    
    } catch (error) {
        throw new Error(error);
    
    };
};