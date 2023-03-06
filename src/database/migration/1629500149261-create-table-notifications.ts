import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createTableNotifications1629500149261
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notificacoes',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            generationStrategy: 'increment',
            isGenerated: true,
          },
          {
            name: 'titulo',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'mensagem',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'categoria',
            type: 'enum',
            enum: ['info', 'atencao', 'urgente', 'sucesso'],
            isNullable: false,
            default: `'info'`,
          },
          {
            name: 'lidaem',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'usuarioid',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'usuariocodtecnico',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notificacoes');
  }
}
