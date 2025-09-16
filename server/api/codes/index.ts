import { db } from "../../db";
import { codes } from "../../db/schema";
import { getCookie } from "h3";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ code: string }>(event);
  const userId = getCookie(event, "userId");

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Не авторизован" });
  }

  if (!body.code) {
    throw createError({ statusCode: 400, statusMessage: "Код не указан" });
  }
  
  const now = new Date();
  const expires = new Date();
  expires.setDate(now.getDate() + 7); // срок действия кода 7 дней

  const [newCode] = await db
    .insert(codes)
    .values({
      user_id: Number(userId),
      code: body.code,
      nick: userId, // можно подставить текущий логин через API /me, если нужно
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
