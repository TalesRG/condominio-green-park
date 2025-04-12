import { MigrationInterface, QueryRunner } from 'typeorm';

export class TabelaLotes1744333578241 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
          CREATE TABLE  IF NOT EXISTS portaria.lotes(
              id INT NOT NULL AUTO_INCREMENT,
              nome VARCHAR(100),
              ativo BOOLEAN DEFAULT TRUE,
              criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              PRIMARY KEY (id)
          );
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table portaria.lotes`);
  }
}
