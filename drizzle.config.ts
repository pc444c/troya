/** @type {import('drizzle-kit').Config} */
module.exports = {
  schema: "./server/db/schema.ts",  // путь к твоей схеме
  out: "./drizzle",                // куда складывать миграции
  dialect: "postgresql",           // тип базы
  dbCredentials: {
    url: process.env.DATABASE_URL, // ссылка на базу
  },
};
