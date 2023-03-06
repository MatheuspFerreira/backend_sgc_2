import { getRepository } from 'typeorm';
import IListProdutos from './interfaces/list-produtos';
import { Produto } from '../../database/entities';
import validator from './validators/list-produto';

export default async function listProdutos({
  limitPerPage,
  page,
}: IListProdutos) {
  await validator({
    limitPerPage,
    page,
  });

  return getRepository(Produto).findAndCount({
    skip: page * limitPerPage,
    take: limitPerPage,
    order: {
      produto: 'ASC',
    },
    // @todo
    where: `produto = BINARY 'iFitness'`,
  });
}
