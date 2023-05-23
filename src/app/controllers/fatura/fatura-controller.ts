import { Response, query } from 'express';
import RequestCustom from '../../../lib/types/RequestCustom';
import getLatestListByYear from '../../../use-cases/fatura/getLatestListByYear';
import getAllByDate from '../../../use-cases/fatura/getAllByDate';
import contestFatura from '../../../use-cases/fatura/contest-fatura';



export default {
  async getLatestList({ params, query, user: requester }: RequestCustom, res: Response) {
    const { codrevenda }= query;
    const { year } = params;
    const faturas = await getLatestListByYear(year, codrevenda as string, requester) as unknown;

    return res.status(200).json(faturas);
  },
  async getFaturaItens({ params, query, user: requester }: RequestCustom, res: Response) {
    const { date } = params;
    const { codrevenda } = query;
    const faturas = await getAllByDate(date, codrevenda as string,  requester) as unknown;

    return res.status(200).json(faturas);
  },
  async contest({ body, user: requester }: RequestCustom, res: Response) { 
    const { cdgFatura, codrevenda, motivo } = body;
    await contestFatura(cdgFatura, codrevenda, motivo, requester) as unknown;

    return res.status(204).json();
  },


};


