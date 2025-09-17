import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { setCookie } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ login: string; password: string }>(event);
  const { login, password } = body;

  if (!login || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Заполните все поля",
    });
  }

  // "маскируем" пароль через Base64 (для теста)
  const passwordHash = Buffer.from(password).toString("base64");

  // ищем пользователя (берём первый элемент массива)
  const [user] = await db.select().from(users).where(eq(users.login, login));

  if (!user) {
    // если пользователя нет — регистрируем
    const [newUser] = await db
      .insert(users)
      .values({
        login,
        passwordHash,
      })
      .returning();

    // сохраняем id пользователя в куки
    setCookie(event, "userId", String(newUser.id), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    });

    return { message: "Пользователь создан", user: { login: newUser.login } };
  } else {
    // если пользователь есть — проверяем пароль
    if (user.passwordHash !== passwordHash) {
      throw createError({
        statusCode: 401,
        statusMessage: "Неверный логин или пароль",
      });
    }

    // сохраняем id пользователя в куки при входе
    setCookie(event, "userId", String(user.id), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { message: "Вход успешен", user: { login: user.login } };
  }
});
