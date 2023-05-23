import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
} from 'typeorm';

export class CreateFaturaItensTable1620753185365 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'faturaItens_sgc',
        columns: [
          new TableColumn({
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',

          }),
          new TableColumn({
            name: 'sistema',
            type: 'varchar',
            isNullable:false
          }),
          new TableColumn({
            name: 'fantasia',
            type: 'varchar',
            isNullable:false
          }),
          new TableColumn({
            name: 'cnpj',
            type: 'varchar',
            isNullable:false
          }),
          new TableColumn({
            name: 'versao',
            type: 'varchar',
            isNullable:false
          }),
          new TableColumn({
            name: 'plano',
            type: 'enum',
            enum: ['mensal', 'anual'],
            isNullable:false
          }),
          new TableColumn({
            name: 'status',
            type: 'enum',
            enum: ['paga', 'aberta', 'vencida', 'cancelada', 'aguardando contestação'],
            default: "'aberta'",

          }),
          new TableColumn({
            name: 'valor',
            type: 'decimal',
            precision: 15,
            scale: 2,
            default: 0,
 
          }),
          new TableColumn({
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',

          }),
          new TableColumn({
            name: 'codcontrato',
            type: 'integer',
            isNullable:false
          }),
        ],
        foreignKeys: [
          {
            name: 'FK_Contrato_FaturaItens',
            columnNames: ['codcontrato'],
            referencedTableName: 'contratos',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('faturaItens_sgc');
  }
}
