import { getRepository } from "typeorm";
import { Atendente } from "../../database/entities";
import IRequester from "../../lib/interfaces/requester";

export default async function autoCompleteAtendente(body: { atendente: string }, requester: IRequester) {
  // Verifica se o requester tem o nível de permissão do Atendente Inspell
  if (requester.p[0] !== "**") {
        throw new Error("Você não tem permissão para realizar essa ação!");
  };

  let { atendente } = body;

  try {
    if (requester.p[0] === "**") {
      if (atendente) {
        atendente = `%${atendente}%`;

        const atendentesFiltrados = await getRepository(Atendente).query(`
          SELECT registro, nome
          FROM atendente
          WHERE LOWER(nome) LIKE LOWER(?)
          OR registro LIKE ?
        `, [atendente, atendente]);

        return atendentesFiltrados;
      }else {
        return {
            error:true,
            msg:'Você precisa enviar os dados do atendente!'
        }
      };
    };
  } catch (error) {
        throw new Error(`${error}`);

    }
}
