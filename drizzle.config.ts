import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/db/schema.ts",
  out: "./drizzle",        // папка, куда будут складываться миграции
  dialect: "postgresql",   // раньше было driver: "pg", теперь dialect
  dbCredentials: {
    url: process.env.DATABASE_URL!, // строка подключения из .env
  },
});
