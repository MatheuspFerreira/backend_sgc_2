import { FindManyOptions, getRepository, ILike } from 'typeorm';
import IListClientes from '../../lib/interfaces/query-list';
import { Cliente } from '../../database/entities';
import {
  podeConsultarClientes,
  useCodigoRevenda,
} from '../../lib/authorizations';
import constants from '../../database/constants';

const { revendaInspell } = constants.clients;

export default async function listClientes(
  { busca }: IListClientes,
  requester: any
) {
  await podeConsultarClientes(requester);

  const codrevenda = useCodigoRevenda(requester);

  const query: FindManyOptions = {
    relations: ['contratos'],
    order: {
      fantasia: 'ASC',
    },
  };

  if (busca) {
    query.where = [
      { cnpj: ILike(`%${busca}%`) },
      { razaosocial: ILike(`%${busca}%`) },
      { fantasia: ILike(`%${busca}%`) },
    ];
  }

  const results = await getRepository(Cliente).find(query);


  /*if (codrevenda) {
    return results.filter(
      (cliente) =>
        cliente.contratos.length > 0 &&
        cliente.contratos.every(
          (contrato) =>
            contrato.codrevenda === codrevenda ||
            contrato.codrevenda === revendaInspell.codrevenda
        ) &&
        cliente.contratos.some((contrato) =>
          ['ativo', 'suspenso'].includes(contrato.status)
        )
    );
  }*/
  
  if (codrevenda) {
    const array = []

    results.map((current)=> {
      const contratos = []
      let contador = 0
      if(current.contratos.length > 0){

        current.contratos.filter(callback => {
          contador ++

          if(callback.codrevenda === codrevenda){
            contratos.push(callback)
              
          };
          if(!array.includes(current) && contador === current.contratos.length && contratos.length > 0){
            current.contratos = contratos
            array.push(current)

          };
          
        });

      };
      

    });
    return array;
  };

  return results;
}