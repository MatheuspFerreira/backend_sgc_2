interface ICliente {
  razaosocial: string;
  fantasia: string;
  cnpj: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  tel1?: string;
  tel2?: string;
  fax?: string;
  email: string;
  inscricaoestadual?: string;
  inscricaomunicipal?: string;
  observacao?: string;
  naoRecebeAtestado?: string;
  id?: number;
  logSiac?: string;
}

export default interface ICreateContract {
  data: ICliente;
}
