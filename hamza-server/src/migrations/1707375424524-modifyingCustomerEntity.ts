import { MigrationInterface, QueryRunner } from "typeorm";

// DROPPING Wallet Address, and makingn email optional
export class ModifyingCustomerEntity1707375424524
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "customer" ALTER COLUMN "email" DROP NOT NULL;
    `);
    await queryRunner.query(`
        ALTER TABLE "customer" DROP COLUMN "wallet_address";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "customer" ALTER COLUMN "email" SET NOT NULL;
    `);
    await queryRunner.query(`
        ALTER TABLE "customer" ADD COLUMN "wallet_address";
    `);
  }
}
