import { getRepository } from "typeorm";
import { TecnicoRevenda } from "../../database/entities";

export default async function getAllTecRevenda(requester: any) {
  if (requester.p.toString() !== "**") {
    throw new Error("Você não possui autorização");
  }

  try {
    const allTecRevenda = await getRepository(TecnicoRevenda).query(`
      SELECT codrevenda, codtecnico, nome
      FROM suporte.tecnicorevenda
      
    `);
    
    return allTecRevenda;
  } catch (error) {
    throw new Error(error);
  }
}
