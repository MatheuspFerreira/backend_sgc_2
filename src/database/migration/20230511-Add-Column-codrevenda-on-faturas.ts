import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddCodRevendaToFaturasSGC20230511000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('faturas_sgc', new TableColumn({
            name: 'codrevenda',
            type: 'int',
            isNullable: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('faturas_sgc', 'codrevenda');
    }
}
