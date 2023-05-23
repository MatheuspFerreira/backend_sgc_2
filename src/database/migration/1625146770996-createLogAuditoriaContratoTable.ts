import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLogAuditoriaContrato1637205876139 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE log_auditoria_contrato (
            id SERIAL PRIMARY KEY,
            cdg_contrato INTEGER NOT NULL,
            cdg_revenda INTEGER NOT NULL,
            cdg_tecrevenda INTEGER NOT NULL,
            atendente_inspell INTEGER NOT NULL,
            cdg_cliente INTEGER NOT NULL,
            acao ENUM('criado', 'suspenso', 'cancelado', 'reativado', aguardando cancelamento) NOT NULL,
            comentario VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NOT NULL
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE log_auditoria_contrato`);
    }
}
