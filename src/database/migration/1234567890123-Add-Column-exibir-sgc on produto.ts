import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddExibirSgcColumn1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'produto',
      new TableColumn({
        name: 'exibir_sgc',
        type: 'enum',
        enum: ['S', 'N'],
        default: "'N'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('produto', 'exibir_sgc');
  }
}
