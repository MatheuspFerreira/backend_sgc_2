import { Response } from 'express';
import RequestCustom from '../../../lib/types/RequestCustom';
import buscarLogsPorIdContrato from '../../../use-cases/log_auditoria/obtain-logs';
import filterLogs from '../../../use-cases/log_auditoria/filter-logs';


export default {
  async obtain({ params, user: requester }: RequestCustom, res: Response) {
    const logs = await buscarLogsPorIdContrato(parseInt(params.id), requester);
    return res.status(200).json(logs);
  },

  async filter({ body, user: requester }: RequestCustom, res: Response) { 
    const logs = await filterLogs(requester, body);
    return res.status(200).json(logs);
  }
  

};
