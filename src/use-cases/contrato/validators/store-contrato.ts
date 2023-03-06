import Joi from '../../../lib/joi';
import { makeValidateFn } from '../../../lib/make-validation';

export const createContract = Joi.object({
  dataInicio: Joi.date().utc().required(),
  campanha: Joi.string().valid('padrao', 'promocional').required(),
  versao: Joi.string().valid('a', 'b').required(),
  /*sufixo: Joi.when('contratoid', {
    is: Joi.exist(),
    then: Joi.forbidden(),
    otherwise: Joi.string().required(),
  }),
  adminEmail: Joi.when('contratoid', {
    is: Joi.exist(),
    then: Joi.forbidden(),
    otherwise: Joi.string().required(),
  }),*/
  codcliente: Joi.number().required(),
  codproduto: Joi.number().required(),
  contratoid: Joi.number(),
});

export default makeValidateFn(createContract);
