import { Unauthorized as UnauthorizedError } from 'http-errors';
import createLogin from '../create-login';
import verify from '../verify';
import { suporteDb } from '../../../database/db';

beforeAll(async () => {
  await suporteDb.connect();
});

afterAll(async () => {
  await suporteDb.close();
});

describe('TESTE UNITÁRIO - Verificar token', () => {
  it('Deve retornar true quando o token é válido', async () => {
    const input = {
      email: 'suporte.inspell1@gmail.com',
      password: 'suporte@inspell',
    };

    const { token } = await createLogin(input);

    const validation = await verify({ token });

    expect(validation).toEqual(true);
  });

  it('Deve retornar erro NÃO AUTORIZADO quando o token não é mais válido', async () => {
    const invalidToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicmV2ZW5kYSIsImlkIjoyNzAsImlhdCI6MTYyOTE1MzkyMywiZXhwIjoxNjI5MTUzOTI0LCJzdWIiOiIyNzAifQ.aMag7vH2MHkHHNDaRpzKxTZmgLMnjEr4JSk5px0Bocw';
    try {
      verify({ token: invalidToken });
    } catch (err) {
      expect(err).toBeInstanceOf(UnauthorizedError);
    }
  });
});
