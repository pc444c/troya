import { db } from "../../db";
import { users } from "../../db/schema";
import { getCookie, readBody } from "h3";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  // Получаем ID пользователя из куки
  const userId = getCookie(event, "userId");
  if (!userId) {
    return { message: "Не авторизован" };
  }

  // Читаем тело запроса
  const body = await readBody<{ oldPassword: string; newPassword: string }>(event);
  const oldPassword = body?.oldPassword?.trim();
  const newPassword = body?.newPassword?.trim();

  if (!oldPassword || !newPassword) {
    return { message: "Оба пароля обязательны" };
  }

  // Хешируем пароли через Base64
  const oldHash = Buffer.from(oldPassword).toString("base64");
  const newHash = Buffer.from(newPassword).toString("base64");

  // Получаем пользователя из базы
  const result = await db.select().from(users).where(eq(users.id, Number(userId)));
  const user = result[0];
  if (!user) {
    return { message: "Пользователь не найден" };
  }

  // Проверяем старый пароль
  if (user.passwordHash.trim() !== oldHash) {
    return { message: "Старый пароль неверный" };
  }

  // Обновляем пароль
  await db.update(users)
    .set({ passwordHash: newHash })
    .where(eq(users.id, Number(userId)));

  return { message: "Пароль успешно обновлен" };
});
