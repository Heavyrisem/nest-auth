import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAndRoleTables1661931957892 implements MigrationInterface {
  name = 'CreateUserAndRoleTables1661931957892';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user_role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`email\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`test\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_role_join\` (\`userId\` int NOT NULL, \`userRoleId\` int NOT NULL, INDEX \`IDX_01a03d1cbe83ba50280edde7d2\` (\`userId\`), INDEX \`IDX_265f5e77194e7ae3b5e600c06a\` (\`userRoleId\`), PRIMARY KEY (\`userId\`, \`userRoleId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_join\` ADD CONSTRAINT \`FK_01a03d1cbe83ba50280edde7d20\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_join\` ADD CONSTRAINT \`FK_265f5e77194e7ae3b5e600c06aa\` FOREIGN KEY (\`userRoleId\`) REFERENCES \`user_role\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_role_join\` DROP FOREIGN KEY \`FK_265f5e77194e7ae3b5e600c06aa\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_join\` DROP FOREIGN KEY \`FK_01a03d1cbe83ba50280edde7d20\``,
    );
    await queryRunner.query(`DROP INDEX \`IDX_265f5e77194e7ae3b5e600c06a\` ON \`user_role_join\``);
    await queryRunner.query(`DROP INDEX \`IDX_01a03d1cbe83ba50280edde7d2\` ON \`user_role_join\``);
    await queryRunner.query(`DROP TABLE \`user_role_join\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`user_role\``);
  }
}
