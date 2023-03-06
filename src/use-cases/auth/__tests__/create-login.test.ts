import {
  Unauthorized as UnauthorizedError,
  Forbidden as ForbiddenError,
} from 'http-errors';
import { decodeToken } from '../../../lib/token';
import createLogin from '../create-login';
import { suporteDb } from '../../../database/db';

beforeAll(async () => {
  await suporteDb.connect();
});

afterAll(async () => {
  await suporteDb.close();
});

describe('TESTE UNITÁRIO - Login', () => {
  describe('Revenda', () => {
    it('Deve retornar o token e as propriedades do usuário', async () => {
      // Dump do banco de suporte
      const input = {
        email: 'suporte.inspell1@gmail.com',
        password: 'suporte@inspell',
      };

      const login = await createLogin(input);
      const decode = decodeToken(login.token);

      expect(login.user).toMatchObject({
        id: expect.any(Number),
      });
      expect(typeof login.token).toBe('string');
      expect(decode).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        type: 'revenda',
      });
    });

    it('Deve retornar erro do tipo NÃO-AUTORIZADO se email e/ou senha estão incorretos', async () => {
      const input = {
        email: 'naoexiste@revenda.com',
        password: '123456',
      };

      await expect(createLogin(input)).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('Técnico Revenda', () => {
    it('Deve retornar o token e as propriedades do usuário', async () => {
      // Dump do banco de suporte
      const input = {
        email: 'fabio@inspell.com.br',
        password: 'ifabio1504',
      };

      const login = await createLogin(input);
      const decode = decodeToken(login.token);

      expect(login.user).toMatchObject({
        id: expect.any(Number),
      });
      expect(typeof login.token).toBe('string');
      expect(decode).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        type: 'tecnicoRevenda',
        p: expect.not.arrayContaining(['*']),
      });
    });

    it('Deve retornar erro do tipo NÃO-AUTORIZADO se email e/ou senha estão incorretos', async () => {
      const input = {
        email: 'naoexiste@tecnicorevenda.com',
        password: '123456',
      };

      await expect(createLogin(input)).rejects.toThrow(UnauthorizedError);
    });

    it('Deve retornar erro do tipo PROIBIDO se o técnico revenda está inativo', async () => {
      const input = {
        email: 'rock@inspell.com.br',
        password: 'xxx',
      };

      await expect(createLogin(input)).rejects.toThrow(ForbiddenError);
    });
  });

  describe('Atendente', () => {
    it('Deve retornar o token e as propriedades do usuário', async () => {
      // Dump do banco de suporte
      const input = {
        email: 'D',
        password: '992747',
      };

      const login = await createLogin(input);
      const decode = decodeToken(login.token);

      expect(login.user).toMatchObject({
        id: expect.any(Number),
      });
      expect(typeof login.token).toBe('string');
      expect(decode).toMatchObject({
        exp: expect.any(Number),
        iat: expect.any(Number),
        type: 'atendente',
      });
    });

    it('Deve retornar erro do tipo NÃO-AUTORIZADO se login e/ou senha estão incorretos', async () => {
      const input = {
        email: 'naoexiste@atendente.com',
        password: '123456',
      };

      await expect(createLogin(input)).rejects.toThrow(UnauthorizedError);
    });

    it('Deve retornar erro do tipo PROIBIDO se o atendente está inativo', async () => {
      const input = {
        email: 'g',
        password: 'g',
      };

      await expect(createLogin(input)).rejects.toThrow(ForbiddenError);
    });
  });
});
