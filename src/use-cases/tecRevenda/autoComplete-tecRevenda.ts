import { getRepository } from "typeorm";
import { TecnicoRevenda } from "../../database/entities";
import IRequester from "../../lib/interfaces/requester";

export default async function autoCompleteTecRevenda(body: { tecRevenda: string }, requester: IRequester) {
  // Verifica se o requester tem o nível de permissão do Atendente Inspell
  if (requester.p[0] !== "**") {
    throw new Error("Você não tem permissão para realizar essa ação!");
  };

  let { tecRevenda } = body;

  try {
    if (requester.p[0] === "**") {
      if (tecRevenda) {
        tecRevenda = `%${tecRevenda}%`;

        const tecRevendasFiltrados = await getRepository(TecnicoRevenda).query(`
          SELECT codrevenda, codtecnico, nome
          FROM tecnicorevenda
          WHERE LOWER(nome) LIKE LOWER(?)
          OR codtecnico LIKE ?
        `, [tecRevenda, tecRevenda]);

        return tecRevendasFiltrados;
      };
    };
  } catch (error) {
    console.log(error);
    throw new Error(`${error}`);
  }
}
