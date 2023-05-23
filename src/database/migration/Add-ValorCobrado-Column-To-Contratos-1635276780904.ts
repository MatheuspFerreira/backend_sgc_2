import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddValorCobradoColumnToContratos1635276780904 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('contratos', new TableColumn({
            name: 'valorCobrado',
            type: 'decimal',
            precision: 15,
            scale: 2,
            default: 0,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('contratos', 'valorCobrado');
    }

}
