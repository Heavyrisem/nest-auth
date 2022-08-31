import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteTestCol1661932851567 implements MigrationInterface {
  name = 'DeleteTestCol1661932851567';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`test\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`test\` varchar(255) NOT NULL`);
  }
}
