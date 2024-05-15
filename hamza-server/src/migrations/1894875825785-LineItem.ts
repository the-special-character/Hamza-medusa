import { MigrationInterface, QueryRunner } from 'typeorm';

export class MultiVendorPayment1893867137584 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "line_item" ADD COLUMN "currency_code" VARCHAR NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "line_item" ADD CONSTRAINT "FK_LineItem_Currency" FOREIGN KEY ("currency_code") REFERENCES "currency"("id")`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "payment" DROP COLUMN "currency_code"`
        );
        await queryRunner.query(
            `ALTER TABLE "line_item" DROP CONSTRAINT "FK_LineItem_Currency"`
        );
    }
}
