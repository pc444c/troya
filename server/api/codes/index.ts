import { db } from "../../db";
import { codes } from "../../db/schema";
import { getCookie, createError, readBody } from "h3";

// Функция для получения текущей даты по Киеву
function getKyivDate(): Date {
  const now = new Date();
  const kyivOffset = 3 * 60; // +3 часа в минутах
  const utcTime = new Date(now.getTime() + kyivOffset * 60 * 1000); // UTC+3
  return utcTime;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ code: string }>(event);
  const userId = getCookie(event, "userId");

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Не авторизован" });
  }

  if (!body.code) {
    throw createError({ statusCode: 400, statusMessage: "Код не указан" });
  }

  // Очищаем код: только цифры, длина 4-6
  const cleanCode = body.code.replace(/\D/g, "");
  if (cleanCode.length < 4 || cleanCode.length > 6) {
    throw createError({ statusCode: 400, statusMessage: "Код должен содержать 4–6 цифр" });
  }

  const now = getKyivDate();
  const expires = new Date(now);
  expires.setDate(now.getDate() + 7); // срок действия кода 7 дней

  const [newCode] = await db
    .insert(codes)
    .values({
      user_id: Number(userId),
      code: cleanCode,
      nick: userId, // можно вставлять логин, если есть
      created_at: now,
      expires_at: expires,
    })
    .returning();

  return {
    success: true,
    message: "Код успешно сохранён",
    code: newCode,
  };
});
