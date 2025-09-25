import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { setCookie, createError, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ login: string; password: string }>(event);
  let { login, password } = body;

  if (!login || !password) {
    throw createError({ statusCode: 400, statusMessage: "Заполните все поля" });
  }

  login = login.trim(); // убираем пробелы
  const passwordHash = Buffer.from(password).toString("base64");

  const [user] = await db.select().from(users).where(eq(users.login, login));

  if (!user) {
    return { success: false, message: "Пользователь не найден. Хотите зарегистрироваться?", requireRegistration: true };
  }

  if (user.passwordHash !== passwordHash) {
    throw createError({ statusCode: 401, statusMessage: "Неверный логин или пароль" });
  }

  setCookie(event, "userId", String(user.id), { httpOnly: true, path: "/", maxAge: 60*60*24*7 });

  return { success: true, message: "Вход успешен", user: { login: user.login, id: user.id } };
});
