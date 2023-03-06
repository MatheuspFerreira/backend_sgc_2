import Joi from '../../../lib/joi';
import { makeValidateFn } from '../../../lib/make-validation';

export const listSchema = Joi.object({
  limitPerPage: Joi.number().integer().min(0).max(30).required(),
  page: Joi.number().integer().min(0).required(),
  usuarioId: Joi.number().integer().min(0).required(),
  usuarioCodTecnico: Joi.number().integer().min(0),
  unread: Joi.boolean().default(false),
});

export default makeValidateFn(listSchema);
