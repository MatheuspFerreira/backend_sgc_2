import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

const FOREIGN_KEY_NAME = 'contratosecundariofk';
export class addColumnCodcontratoOnContratos1638024109300
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'contratos',
      new TableColumn({
        name: 'contratoid',
        type: 'integer',
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      'contratos',
      new TableForeignKey({
        name: FOREIGN_KEY_NAME,
        columnNames: ['contratoid'],
        referencedTableName: 'contratos',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE contratos DROP FOREIGN KEY ${FOREIGN_KEY_NAME}`
    );
    await queryRunner.query('ALTER TABLE contratos DROP COLUMN contratoid');
  }
}
