import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnStatusToContratos1642346858266
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('contratos', [
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['ativo', 'suspenso', 'cancelado', 'aguardando cancelamento'],
        default: `'ativo'`,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('contratos', [
      new TableColumn({
        name: 'status',
        type: 'enum',
      }),
    ]);
  }
}
