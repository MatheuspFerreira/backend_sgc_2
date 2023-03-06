import { BadRequest as BadRequestError } from 'http-errors';

export function makeValidateFn(schema: any) {
  return (...input: any[]) => {
    const { error, value } = schema.validate(...input);

    if (error) {
      //console.log(error.message)
      throw new BadRequestError(error.message);
      
    }

    return value;
  };
}
