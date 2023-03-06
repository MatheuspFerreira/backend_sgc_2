import { getRepository } from "typeorm"
import { Revenda } from "../../database/entities"

export default async function getAllRevendas (requester:any) {
    //console.log(requester.p)
    if(requester.p.toString() !== '**'){
        return {
            error:true,
            message:'Você não possui autorização'
        }
    }

    try {
        const allRevendas = await getRepository(Revenda).findAndCount({
            where:{
                ativa:'T'
            }
        });
        //console.log(allRevendas)
    
        return {
            permission:requester.p,
            revenda:allRevendas[0]
        }
        
    } catch (error) {
        //console.log(error)

        return {
            error:true,
            message:error
        }
        
    }

    



}