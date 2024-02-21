import { MigrationInterface, QueryRunner } from "typeorm";

export class CurrencyCreate1706076346146 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "Currency" (code, symbol, symbol_native, name) VALUES ('ETH', 'Ξ', 'Ξ', 'Ethereum')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`DELETE FROM "currency" WHERE code = 'eth'`);
  }
}
