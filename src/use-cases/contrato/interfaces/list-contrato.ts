import IQueryList from '../../../lib/interfaces/query-list';

export default interface IListContracts extends IQueryList {
  limitPerPage: number;
  page: number;
  requester: any;
  codcliente?: number;
}
