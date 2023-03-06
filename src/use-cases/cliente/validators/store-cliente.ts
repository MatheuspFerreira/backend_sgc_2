import Joi from '../../../lib/joi';
import { makeValidateFn } from '../../../lib/make-validation';

export const storeSchema = Joi.object({
  razaosocial: Joi.string().max(150).required(),
  fantasia: Joi.string().max(150).required(),
  cnpj: Joi.string().trim().regex(/^\d+$/).required(),
  endereco: Joi.string().max(150).required(),
  bairro: Joi.string().max(50).required(),
  cidade: Joi.string().max(70).required(),
  uf: Joi.string().length(2).required(),
  cep: Joi.string().regex(/^\d+$/).trim().max(12),
  tel1: Joi.string().max(15).allow('', null),
  tel2: Joi.string().max(15).allow('', null),
  fax: Joi.string().max(15).allow('', null),
  email: Joi.string().max(150).allow('', null),
  inscricaoestadual: Joi.string().max(20).allow('', null),
  inscricaomunicipal: Joi.string().max(20).allow('', null),
  observacao: Joi.string().optional().allow('', null),
  naoRecebeAtestado: Joi.string().length(1).allow('', null),
  id: Joi.number().integer().allow('', null),
  logSiac: Joi.string().optional().allow('', null),
});

export default makeValidateFn(storeSchema);
