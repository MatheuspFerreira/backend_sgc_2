/// <reference lib="dom" />
import axios from 'axios';


export default async function CreateContractApi (obj:any) { // Cria o contrato no banco de dados IFitness
    
    try {
        const token = 'X/C2YXLrVOnQfs7amXytFazld107W5SIo4+Rz1VH9Ds=';

        const { data } = await axios.post(`https://ifitnessweb.com.br/webservice/public/api/gerarNovoBanco`, obj, {
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
