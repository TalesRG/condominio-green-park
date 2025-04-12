import { MigrationInterface, QueryRunner } from 'typeorm';

export class InserirLotes1744433649269 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT IGNORE INTO portaria.lotes (id, nome, ativo, criado_em) VALUES (3, '0017', DEFAULT, DEFAULT)`,
    );
    await queryRunner.query(
      `INSERT IGNORE INTO portaria.lotes (id, nome, ativo, criado_em) VALUES (6, '0018', DEFAULT, DEFAULT)`,
    );
    await queryRunner.query(
      `INSERT IGNORE INTO portaria.lotes (id, nome, ativo, criado_em) VALUES (7, '0019', DEFAULT, DEFAULT)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM portaria.lotes WHERE id IN (3, 6, 7)`);
  }
}
