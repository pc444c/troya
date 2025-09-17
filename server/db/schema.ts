import { pgTable,integer, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  login: varchar("login", { length: 256 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
export const codes = pgTable("codes", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id), // связь с пользователем
  code: varchar("code", { length: 50 }).notNull(),                 // сам код
  nick: varchar("nick", { length: 256 }).notNull(),               // ник пользователя при получении кода
  created_at: timestamp("created_at").defaultNow().notNull(),     // дата создания кода
  expires_at: timestamp("expires_at").notNull(),                  // срок действия кода
});