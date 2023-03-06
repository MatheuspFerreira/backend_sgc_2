import Joi from '../../../lib/joi';
import { makeValidateFn } from '../../../lib/make-validation';

export const obtainSchema = Joi.object({
  id: Joi.number().integer().min(0).required(),
});

export default makeValidateFn(obtainSchema);
