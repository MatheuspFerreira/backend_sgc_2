import Joi from '../../../lib/joi';
import { makeValidateFn } from '../../../lib/make-validation';

export const createContract = Joi.object({
  sufixo: Joi.string().trim().required(),
});

export default makeValidateFn(createContract);
