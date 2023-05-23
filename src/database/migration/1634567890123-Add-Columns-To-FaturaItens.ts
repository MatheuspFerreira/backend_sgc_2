import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumnsToFaturaItens1634567890123 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE faturaitens_sgc ADD COLUMN inicial date`);
        await queryRunner.query(`ALTER TABLE faturaitens_sgc ADD COLUMN final date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE faturaitens_sgc DROP COLUMN inicial`);
        await queryRunner.query(`ALTER TABLE faturaitens_sgc DROP COLUMN final`);
    }

}
