import { db } from "../db";
import { users } from "../db/schema";
import { setCookie, readBody, createError } from "h3";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ login: string; password: string }>(event);
  let { login, password } = body;

  if (!login || !password)
    throw createError({ statusCode: 400, statusMessage: "Заполните все поля" });

  login = login.trim(); // убираем пробелы
  const passwordHash = Buffer.from(password).toString("base64");

  // Проверка на существующего пользователя
  const [existingUser] = await db.select()
    .from(users)
    .where(eq(users.login, login));

  if (existingUser)
    throw createError({ statusCode: 409, statusMessage: "Пользователь уже существует" });

  // Создание пользователя
  const [newUser] = await db.insert(users)
    .values({ login, passwordHash })
    .returning();

    
  // Сохраняем куки
  setCookie(event, "userId", String(newUser.id), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return {
    success: true,
    message: "Пользователь создан",
    user: { login: newUser.login, id: newUser.id },
  };
});
