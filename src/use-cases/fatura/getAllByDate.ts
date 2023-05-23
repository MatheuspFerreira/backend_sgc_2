import { getRepository, Between } from "typeorm";
import { podeConsultarClientes } from "../../lib/authorizations";
import IRequester from "../../lib/interfaces/requester";
import FaturaItens from "../../database/entities/fatura-itens.entity";

export default async function getAllByDate (data:string, codRevenda:string, requester:IRequester) {
    
    podeConsultarClientes(requester);
    

    let codrevenda = requester.id as unknown;
 
    if(requester.type === 'atendente' && codRevenda){
        codrevenda = codRevenda
    };

    // Recebe a data no formato "yyyy-mm"
    const yearMonth = data.split('-');
    const year = yearMonth[0];
    const month = yearMonth[1];
    let yearInitial = yearMonth[0];
    let monthInitial = yearMonth[1]


    if(parseInt(month) > 1 && parseInt(month) <= 9){
        monthInitial = `0${parseInt(month)-1}`;

    }else if(parseInt(month) === 1){
        monthInitial = '12';
        yearInitial = `${parseInt(year)-1}`;

    }else {
        monthInitial =  `${parseInt(month)-1}`;

    };

    
    // Definir início do contrato
    const firstDayOfMonth = new Date(`${yearInitial}-${monthInitial}-20`).toISOString();
   
    // Definir fim do contrato
    const lastDayOfMonth = new Date(`${year}-${month}-19`).toISOString();
    
    try {
        const faturas = await getRepository(FaturaItens)
            .createQueryBuilder('faturaItens')
            .leftJoinAndSelect('faturaItens.contrato', 'contrato')
            .where('faturaItens.inicial BETWEEN :firstDayOfMonth AND :lastDayOfMonth', {
                firstDayOfMonth,
                lastDayOfMonth,
            })
            .andWhere('contrato.codrevenda = :codrevenda', { codrevenda: `${codrevenda}` })
            .getMany()

        return faturas
        
    } catch (error) {
        throw new Error (error);
        
    };

};




