import { getRepository } from 'typeorm';

import { Cliente } from '../../database/entities';
import hasActiveContracts from './business-rules/has-active-contracts';

import validator from './validators/can-store-contrato';

export default async function canStore({
  cnpj,
  tipoDoc,
  requester,
  codRevenda
}: {
  cnpj: string;
  tipoDoc: string;
  requester: any;
  codRevenda:string
}) {
  await validator({ cnpj, tipoDoc });

  const cliente = await getRepository(Cliente).findOne({
    where: {
      cnpj,
    },
    relations: ['contratos', 'contratos.contrato'],
  });

 // console.log(cliente)
  
  {if(requester.p.toString() === '**'){ // Se for atendente da inspell, vai enviar o código da revenda
    //console.log(codRevenda)
    
    // Se é um cliente já licenciado por outra revenda
    await hasActiveContracts(cliente, parseInt(codRevenda));
   // console.log(cliente)

    // Retorna cliente apenas se ele pode criar novo contrato
    // Se o cliente tiver contratos ativos, com certeza
    // esses contratos ou são da própria revenda, ou são prospecção
    // Para aparecer a tela multiunidades no frontend, basta que
    // pelo menos UM contrato esteja ativo, não importa a revenda.
    return cliente;

  }}

  // Se é um cliente já licenciado por outra revenda
  await hasActiveContracts(cliente, requester.id);
 // console.log(cliente)

  // Retorna cliente apenas se ele pode criar novo contrato
  // Se o cliente tiver contratos ativos, com certeza
  // esses contratos ou são da própria revenda, ou são prospecção
  // Para aparecer a tela multiunidades no frontend, basta que
  // pelo menos UM contrato esteja ativo, não importa a revenda.
  return cliente;
}
