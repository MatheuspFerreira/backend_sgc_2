import { getRepository } from "typeorm"
import { Atendente } from "../../database/entities"

export default async function getAllAtendentes (requester:any) {
    if(requester.p.toString() !== '**'){
      throw new Error('Você não possui autorização');  
    };

  try {
    const allAtendente = await getRepository(Atendente).findAndCount({
      select: [ 'registro', 'nome']
    });

    return allAtendente[0];

  } catch (error) {
      throw new Error(error);

    };
}

       