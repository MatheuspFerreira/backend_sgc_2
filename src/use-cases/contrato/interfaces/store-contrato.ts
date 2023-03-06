import CampaignType from '../../../lib/types/CampaignType';
import VersionType from '../../../lib/types/VersionType';

export default interface ICreateContract {
  dataInicio: Date;
  campanha: CampaignType;
  versao: VersionType;
  sufixo?: string;
  adminEmail?: string;
  codcliente: number;
  codproduto: number;
  contratoid?: number;
  revenda:any
}
