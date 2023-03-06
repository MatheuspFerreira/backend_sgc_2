import { Response } from 'express';
import RequestCustom from '../../../lib/types/RequestCustom';
import listProdutos from '../../../use-cases/produto/list-produto';

export default {
  async list({ query }: RequestCustom, res: Response) {
    const produtos = await listProdutos({
      limitPerPage: query.limitPerPage as unknown as number,
      page: query.page as unknown as number,
    });

    return res.status(200).json(produtos);
  },
};
