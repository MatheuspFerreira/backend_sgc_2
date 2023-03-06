import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class removeColumnPeriodicidadeFromContratos1642345909131
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('contratos', [
      new TableColumn({
        name: 'periodicidade',
        type: 'enum',
      }),
      new TableColumn({
        name: 'datafim',
        type: 'date',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('contratos', [
      new TableColumn({
        name: 'periodicidade',
        type: 'enum',
        enum: ['mensal', 'anual'],
        default: `'mensal'`,
      }),
      new TableColumn({
        name: 'datafim',
        type: 'date',
        isNullable: true,
      }),
    ]);
  }
}
