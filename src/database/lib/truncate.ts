import { getManager } from 'typeorm';

const entityManager = getManager();

const truncatableTables = ['notificacoes', 'contratos'];

export default async function truncate(): Promise<void> {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error(
      'Essa operação deve ser executada apenas em ambiente de teste!!!'
    );
  }

  const truncations = truncatableTables.map((table) =>
    entityManager.query(`DELETE FROM ${table}`)
  );

  await entityManager.query('SET FOREIGN_KEY_CHECKS=0;');

  await Promise.all(truncations);

  await entityManager.query('SET FOREIGN_KEY_CHECKS=1;');
}
