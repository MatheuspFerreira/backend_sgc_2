import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createTableContracts1630776736652 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'contratos',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            generationStrategy: 'increment',
            isGenerated: true,
          },
          {
            name: 'datainicio',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'datafim',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'periodicidade',
            type: 'enum',
            enum: ['mensal', 'anual', 'custom'],
            default: `'mensal'`,
          },
          {
            name: 'sufixo',
            type: 'varchar(50)',
            isNullable: true,
          },
          {
            name: 'codrevenda',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'codproduto',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'id_ifitness_web',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'tipo',
            type: 'enum',
            enum: ['principal', 'multi-unidade'],
            default: `'principal'`,
          },
          {
            name: 'planos',
            type: 'enum',
            enum: ['anual', 'mensal'],
            default: `'mensal'`,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('contratos');
  }
}
