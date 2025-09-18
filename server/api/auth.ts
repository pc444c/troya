import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { setCookie, createError, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ login: string; password: string }>(event);
  const { login, password } = body;

  if (!login || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Заполните все поля",
    });
  }

  // Для теста "хешируем" пароль через Base64
  const passwordHash = Buffer.from(password).toString("base64");

  // Ищем пользователя
  const [user] = await db.select().from(users).where(eq(users.login, login));

  if (!user) {
    // Если пользователя нет — создаём
    const [newUser] = await db
      .insert(users)
      .values({ login, passwordHash })
      .returning();

    // Сохраняем id пользователя в куки
    setCookie(event, "userId", String(newUser.id), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    });

    return {
      success: true,
      message: "Пользователь создан",
      user: { login: newUser.login, id: newUser.id },
    };
  } else {
    // Если есть — проверяем пароль
    if (user.passwordHash !== passwordHash) {
      throw createError({
        statusCode: 401,
        statusMessage: "Неверный логин или пароль",
      });
    }

    // Сохраняем куки при входе
    setCookie(event, "userId", String(user.id), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    });

    return {
      success: true,
      message: "Вход успешен",
      user: { login: user.login, id: user.id },
    };
  }
});
