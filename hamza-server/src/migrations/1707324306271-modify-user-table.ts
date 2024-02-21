import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyUserTable1707324306271 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "user" ADD COLUMN "wallet_address" VARCHAR NOT NULL DEFAULT '';
    `);
    await queryRunner.query(`
        ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user" DROP COLUMN "wallet_address";
    `);
    await queryRunner.query(`
        ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL;
    `);
  }
}
