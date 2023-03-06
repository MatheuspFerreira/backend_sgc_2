import IQueryList from '../../../lib/interfaces/query-list';

export default interface IListProdutos extends IQueryList {
  limitPerPage: number;
  page: number;
}
