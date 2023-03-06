import listProdutos from '../list-produto';
import { suporteDb } from '../../../database/db';

beforeAll(async () => {
  await suporteDb.connect();
});

afterAll(async () => {
  await suporteDb.close();
});

describe('TESTE UNITÁRIO - Listar Produtos', () => {
  it('Deve listar todos os produtos', async () => {
    // No contexto dessa aplicação, os produtos é apenas o iFitness
    const list = await listProdutos({
      page: 0,
      limitPerPage: 10,
    });

    expect(list[0]).toHaveLength(1);
  });
});
