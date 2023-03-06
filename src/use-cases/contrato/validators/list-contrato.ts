import Joi from '../../../lib/joi';
import { makeValidateFn } from '../../../lib/make-validation';

export const listSchema = Joi.object({
  limitPerPage: Joi.number().integer().min(0).max(30).required(),
  page: Joi.number().integer().min(0).required(),
});

export default makeValidateFn(listSchema);
