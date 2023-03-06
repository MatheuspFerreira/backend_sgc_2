import isValid from '../../../lib/cei-validator';
import Joi from '../../../lib/joi';
import { makeValidateFn } from '../../../lib/make-validation';

export const createContract = Joi.object({
  tipoDoc: Joi.string().valid('cnpj', 'cpf', 'cei').required(),
  cnpj: Joi.when('tipoDoc', {
    is: 'cnpj',
    then: Joi.document().trim().regex(/^\d+$/).required(),
  })
    .when('tipoDoc', {
      is: 'cpf',
      then: Joi.document().trim().regex(/^\d+$/).cpf().required(),
    })
    .when('tipoDoc', {
      is: 'cei',
      then: Joi.string().custom((value: string, helpers: any) => {
        if (!isValid(value)) {
          return helpers.message('CEI Inválido');
        }

        return value;
      }),
    }),
});

export default makeValidateFn(createContract);
