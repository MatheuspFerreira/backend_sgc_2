import * as Joi from 'joi';
import JoiDate from '@joi/date';
import documentValidator from 'cpf-cnpj-validator';

export default Joi.defaults((schema) =>
  schema.prefs({ abortEarly: false, stripUnknown: true })
)
  .extend(JoiDate)
  .extend(documentValidator);
