/// <reference lib="dom" />
import axios from 'axios';

type props = {
    nome_fantasia: string;
    razao_social: string;
    ativo: string;
    prefix: String
    cnpj_cpf: string

}

export default async function CreateMultUnitApi (obj:props) { // Cria contrato Multi-unidade no banco de dados IFitness
    
    try {
        const token = 'X/C2YXLrVOnQfs7amXytFazld107W5SIo4+Rz1VH9Ds=';

        const { data } = await axios.post(`https://ifitnessweb.com.br/webservice/public/api/${obj.prefix}/unidades`, obj, {
            headers: {
              token: token,
            },
            
        });

       return data
        
    } catch (error) {
        return {
            error:true,
            message:error
        };
        
    };
    
};
