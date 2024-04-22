import { MigrationInterface, QueryRunner } from 'typeorm';

export class MultiVendorOrder1907365738273 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // drop constraint so that a cart can have multiple associated
        await queryRunner.query(
            `ALTER TABLE "order" DROP CONSTRAINT "REL_c99a206eb11ad45f6b7f04f2dc"`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "order" ADD CONSTRAINT "REL_c99a206eb11ad45f6b7f04f2dc" UNIQUE ("cart_id")`
        );
    }
}
