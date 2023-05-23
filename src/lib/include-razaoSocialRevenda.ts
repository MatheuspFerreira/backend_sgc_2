import { LogAuditoriaContrato } from "../database/entities";
import getAllRevendas from "../use-cases/revenda/getAll-revenda";
import IRequester from "./interfaces/requester";

export default async function includeRazaoRevenda (data:LogAuditoriaContrato[], requester:IRequester){

    if(data.length !== 0){
        const revendas = await getAllRevendas(requester);
        for (let i = 0; i < revendas.revenda.length; i++) {
  
          const newLogList = data.map((current, index)=>{
            if(current.cdg_revenda === revendas.revenda[i].codrevenda){
              const newObj = {...current, razaoSocialRevenda: revendas.revenda[i].razaosocial};
              return newObj;
            } else {
              return current;
            }
          });
  
          data = newLogList
          
        }    
        

        return data

    }
    

}