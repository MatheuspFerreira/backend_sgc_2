import { getRepository } from "typeorm"
import { Revenda } from "../../database/entities"

export default async function getAllRevendas (requester:any) {
    if(requester.p.toString() !== '**'){
        throw new Error('Você não possui autorização');  
    };

    try {
        const allRevendas = await getRepository(Revenda).findAndCount({
            where:{
            },
            select: [ 'codrevenda', 'razaosocial']
        });
    
        return {
            revenda:allRevendas[0]
        };
    } catch (error) {
        throw new Error(error);  
    };
};