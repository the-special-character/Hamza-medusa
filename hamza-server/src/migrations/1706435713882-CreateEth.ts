import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEth1706435713882 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "currency" (code, symbol, symbol_native, name) VALUES ('eth', 'Ξ', 'Ξ', 'Ethereum Decentralized Currency')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
