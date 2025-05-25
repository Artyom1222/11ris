import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1719984123432 implements MigrationInterface {
  name = 'CreateInitialTables1719984123432';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создание расширения для генерации UUID
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Создание таблицы tours
    await queryRunner.query(`
      CREATE TABLE "tours" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "slug" character varying NOT NULL,
        "description" character varying NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tours" PRIMARY KEY ("id")
      )
    `);

    // Создание таблицы schedules
    await queryRunner.query(`
      CREATE TABLE "schedules" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tourId" uuid NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "startDate" character varying NOT NULL,
        "endDate" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_schedules" PRIMARY KEY ("id")
      )
    `);

    // Создание таблицы prices
    await queryRunner.query(`
      CREATE TABLE "prices" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "scheduleId" uuid NOT NULL,
        "priceValue" numeric(10,2) NOT NULL,
        "priceCurrency" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_prices" PRIMARY KEY ("id")
      )
    `);

    // Добавление внешних ключей
    await queryRunner.query(`
      ALTER TABLE "schedules" 
      ADD CONSTRAINT "FK_schedules_tours" 
      FOREIGN KEY ("tourId") 
      REFERENCES "tours"("id") 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "prices" 
      ADD CONSTRAINT "FK_prices_schedules" 
      FOREIGN KEY ("scheduleId") 
      REFERENCES "schedules"("id") 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаление внешних ключей
    await queryRunner.query(`
      ALTER TABLE "prices" 
      DROP CONSTRAINT "FK_prices_schedules"
    `);

    await queryRunner.query(`
      ALTER TABLE "schedules" 
      DROP CONSTRAINT "FK_schedules_tours"
    `);

    // Удаление таблиц
    await queryRunner.query(`DROP TABLE "prices"`);
    await queryRunner.query(`DROP TABLE "schedules"`);
    await queryRunner.query(`DROP TABLE "tours"`);
  }
}
