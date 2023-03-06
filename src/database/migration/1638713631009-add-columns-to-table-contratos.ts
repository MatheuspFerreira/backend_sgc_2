import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
  } from 'typeorm';
  
  const FOREIGN_KEY_NAME = 'contratocodcliente';
  
  export class addColumnsToTableContratos1638713631009
    implements MigrationInterface
  {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumns('contratos', [
        new TableColumn({
          name: 'campanha',
          type: 'enum',
          enum: ['padrao', 'promocional'],
          default: `'padrao'`,
        }),
        new TableColumn({
          name: 'versao',
          type: 'enum',
          enum: ['a', 'b'],
          default: `'a'`,
        }),
        new TableColumn({
          name: 'admin_email',
          type: 'varchar',
          isNullable: true,
        }),
        new TableColumn({
          name: 'codcliente',
          type: 'integer',
          isNullable: false,
        }),
        new TableColumn({
          name: 'tipo',
          type: 'varchar',
          isNullable: false,
        }),
        new TableColumn({
          name: 'id_ifitness_web',
          type: 'varchar',
          isNullable: false,
        }),
  
      ]);
  
  
      await queryRunner.createForeignKey(
        'contratos',
        new TableForeignKey({
          name: FOREIGN_KEY_NAME,
          columnNames: ['codcliente'],
          referencedTableName: 'cliente',
          referencedColumnNames: ['codcliente'],
        })
      );
    }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        `ALTER TABLE contratos DROP FOREIGN KEY ${FOREIGN_KEY_NAME}`
      );
  
      await queryRunner.dropColumns('contratos', [
        new TableColumn({
          name: 'campanha',
          type: 'enum',
        }),
        new TableColumn({
          name: 'versao',
          type: 'enum',
        }),
        new TableColumn({
          name: 'codcliente',
          type: 'integer',
        }),
        new TableColumn({
          name: 'admin_email',
          type: 'varchar',
        }),
      ]);
    }
  }