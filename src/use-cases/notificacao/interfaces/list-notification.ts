import IQueryList from '../../../lib/interfaces/query-list';

export default interface IListNotifications extends IQueryList {
  limitPerPage: number;
  page: number;
  usuarioId: string;
  usuarioCodTecnico?: string;
  unread?: boolean;
}
