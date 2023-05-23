import { getRepository } from "typeorm";
import { Revenda } from "../../database/entities";
import transporter from "./config";



export default async function  sendEmail (codrevenda:string, motivo:string, competencia:string) {  
    
    const revenda = await getRepository(Revenda).findOne({
        where:{
            codrevenda:codrevenda
        }
    });

    const competenciaContest = competencia.split('-')

   if(!revenda){
       throw new Error('Revenda não encontrada!')
    };
    
    const dataAtual = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const dataHoraFormatada = dataAtual.toLocaleString('pt-BR', options);
    

   try {
    console.log('enviando email')
        const res = await transporter.sendMail({
            from: 'matheus@inspell.com',
            to: 'alves.mfp@gmil.com',
            subject: `SGC - Fatura Contestada - ${revenda.fantasia}`,
            html: `
                <h2>Prezado,</h2><br>

                <p>A revenda ${revenda.fantasia} com código ${revenda.codrevenda} solicitou a contestação da fatura de competência ${competenciaContest[1]}/${competenciaContest[0]}
                através do sistema SGC.</p><br>

                <h3>Motivo da contestação: </h3><br>

                <p>${motivo}</p><br>
                
                Data da solicitação: ${dataHoraFormatada}
            `
        });
        console.log(res.rejected)

        if (res.rejected.length) {
            console.log(res.rejected)
            throw new Error(`Falha ao enviar o e-mail para o seguinte destinatário: ${revenda.codrevenda}`)
        };
 
        return true;

    } catch (error) {
        console.log(error)
        throw new Error(error);
        
    };

};