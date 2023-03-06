/// <reference lib="dom" />
import axios from 'axios';

export default async function deactivate (prefix:string, id:number) { // Cria contrato Multi-unidade no banco de dados IFitness
    
    try {
        const token = 'X/C2YXLrVOnQfs7amXytFazld107W5SIo4+Rz1VH9Ds=';

        const { data } = await axios.put(`https://ifitnessweb.com.br/webservice/public/api/${prefix}/unidades/${id}/inativar`,{}, {
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
