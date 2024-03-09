import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWalletToCustomer1709792473378 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "customer" ADD COLUMN "wallet_address" VARCHAR NOT NULL DEFAULT '';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      ALTER TABLE "customer" DROP COLUMN "wallet_address";
    `);
    }

}
