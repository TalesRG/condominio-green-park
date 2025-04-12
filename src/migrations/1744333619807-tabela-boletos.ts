import { MigrationInterface, QueryRunner } from 'typeorm';

export class TabelaBoletos1744333619807 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS boletos(
             id INT NOT NULL AUTO_INCREMENT,
             nome_sacado VARCHAR(255),
             id_lote INT NOT NULL,
             valor DECIMAL,
             linha_digitavel VARCHAR(255),
             ativo BOOLEAN,
             criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (id_lote) REFERENCES portaria.lotes(id)
                );
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`delete table boletos`);
  }
}
