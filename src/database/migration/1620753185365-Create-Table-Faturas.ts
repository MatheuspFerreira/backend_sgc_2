import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
} from 'typeorm';

export class CreateFaturasTable1620753185365 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'faturas_sgc',
        columns: [
          new TableColumn({
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          }),
          new TableColumn({
            name: 'status',
            type: 'enum',
            enum: ['paga', 'aberta', 'vencida', 'cancelada', 'aguardando contestação'],
            default: "'aberta'",
          }),
          new TableColumn({
            name: 'competencia',
            type: 'datetime',
            isNullable:false

          }),
          new TableColumn({
            name: 'vencimento',
            type: 'datetime',
            isNullable:false
  
          }),
          new TableColumn({
            name: 'valor',
            type: 'decimal',
            precision: 15,
            scale: 2,
            default: 0,
          }),
          new TableColumn({
            name: 'data_aprovacao',
            type: 'datetime',
          }),
          new TableColumn({
            name: 'aprovador',
            type: 'varchar',
          }),
          new TableColumn({
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('faturas_sgc');
  }
}
