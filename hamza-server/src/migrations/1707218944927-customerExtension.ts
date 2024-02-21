import { MigrationInterface, QueryRunner } from "typeorm";

export class CustomerExtension1707218944927 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "customer" ADD COLUMN "wallet_address" varchar;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "customer" DROP COLUMN "wallet_address";
    `);
  }
}

// Email alternation that we HAVE NOT RAN YET

// // Set the "email" column default value to null
// await queryRunner.query(`
//         ALTER TABLE "customer" ALTER COLUMN "email" SET DEFAULT null
//     `);
//
// // Remove the not null constraint from the "email" column
// await queryRunner.query(`
//         ALTER TABLE "customer" ALTER COLUMN "email" DROP NOT NULL;
//     `);
