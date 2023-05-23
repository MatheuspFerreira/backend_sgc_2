import { getRepository } from "typeorm";
import TabelaPrecos from "../../database/entities/tabela-precos.entity";
import { podeConsultarClientes, podeLicenciarClientes } from "../../lib/authorizations";
import IRequester from "../../lib/interfaces/requester";

export default async function getLastest (id:string, requester:IRequester) {

    //Verifica se o Requester tem permissão
    podeLicenciarClientes(requester);
    podeConsultarClientes(requester);

    try {

        const tabelaPrecos = await getRepository(TabelaPrecos)
        .createQueryBuilder('tabela_precos')
        .where({ 
            codproduto: id,
        })
        .orderBy('tabela_precos.dtinicial', 'DESC')
        .getMany();

        let latestTabFiltred: TabelaPrecos[] = [];

        for (const current of tabelaPrecos) {
            const dataFinal = current.dtfinal ? new Date(current.dtfinal).toISOString().substring(0, 10) : null;
            const currentData = new Date().toISOString().substring(0, 10);

            if (current.promocional === 'S' && (!dataFinal || dataFinal >= currentData)) {
                // Se a tabela atual for promocional e estiver vigente
                return [current];
            }
            else if (
                current.promocional === 'F' && 
                (!dataFinal || dataFinal >= currentData) && 
                latestTabFiltred.length === 0
            ) {
                // Se a tabela atual não for promocional e estiver vigente, 
                // e se ainda não houver outra tabela selecionada até o momento
                latestTabFiltred.push(current);
            };
        };

        return latestTabFiltred; // Retorna a tabela mais recente não promocional vigente, ou um array vazio (caso não haja)
        
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
        
    };

};