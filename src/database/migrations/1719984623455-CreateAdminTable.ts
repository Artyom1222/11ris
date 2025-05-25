import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class CreateAdminTable1719984623455 implements MigrationInterface {
  name = 'CreateAdminTable1719984623455';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создание таблицы admins
    await queryRunner.query(`
      CREATE TABLE "admins" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "login" varchar NOT NULL,
        "password" varchar NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_admin_login" UNIQUE ("login"),
        CONSTRAINT "PK_admins" PRIMARY KEY ("id")
      )
    `);

    // Создание администратора по умолчанию
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin', saltRounds);

    await queryRunner.query(`
      INSERT INTO "admins" ("login", "password", "isActive")
      VALUES ('admin', '${hashedPassword}', true)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "admins"`);
  }
}
