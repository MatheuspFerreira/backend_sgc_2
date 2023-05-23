import { getRepository } from 'typeorm';
import { Contrato } from '../../database/entities';
import IRequester from '../../lib/interfaces/requester';

interface IndicadoresPorMes {
  [mes: number]: {
    ativo: number;
    suspenso: number;
    aguardandoCancelamento: number;
    cancelado: number;
  };
}

export default async function contractsCountYear(requester: IRequester) {
  try {
    if (requester.p[0] === '**') {
      // Obter todos os contratos do ano atual
      const dataAtual = new Date();
      const anoAtual = dataAtual.getFullYear();
      const contratos = await getRepository(Contrato).createQueryBuilder('contrato')
        .where('YEAR(contrato.dataInicio) = :ano', { ano: anoAtual })
        .getMany();

      // Separa os contratos por mês e status
      const indicadoresPorMes: IndicadoresPorMes = {};
      contratos.forEach((contrato) => {
        const mes = contrato.dataInicio.getMonth() + 1;
        let status = contrato.status.toLowerCase().replace(/\s/g, '');
        if (!indicadoresPorMes[mes]) {
          indicadoresPorMes[mes] = {
            ativo: 0,
            suspenso: 0,
            aguardandoCancelamento: 0,
            cancelado: 0,
          };
        }
        if (status === 'aguardandocancelamento') {
          status = 'aguardandoCancelamento';
        }
        indicadoresPorMes[mes][status]++;
      });

      // Retorna a quantidade de contratos por status para cada mês
      return indicadoresPorMes;
    } else {
      // Define o cód da revenda
      const revenda = requester.id;

      // Obter todos os contratos do ano atual da revenda
      const dataAtual = new Date();
      const anoAtual = dataAtual.getFullYear();
      const contratos = await getRepository(Contrato).createQueryBuilder('contrato')
        .where('YEAR(contrato.dataInicio) = :ano', { ano: anoAtual })
        .andWhere('contrato.codrevenda = :revenda', { revenda: revenda })
        .getMany();

      // Separa os contratos por mês e status
      const indicadoresPorMes: IndicadoresPorMes = {};
      contratos.forEach((contrato) => {
        const mes = new Date(contrato.dataInicio).getMonth() + 1;
        let status = contrato.status.toLowerCase().replace(/\s/g, '');
        if (!indicadoresPorMes[mes]) {
          indicadoresPorMes[mes] = {
            ativo: 0,
            suspenso: 0,
            aguardandoCancelamento: 0,
            cancelado: 0,
          };
        }
        if (status === 'aguardandocancelamento') {
          status = 'aguardandoCancelamento';
        }
        indicadoresPorMes[mes][status]++;
      });

      // Retorna a quantidade de contratos por status para cada mês
      return indicadoresPorMes;
    }
  } catch (error) {
    console.log(error);
    throw new Error(`${error}`);
  }
}
