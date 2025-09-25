import { db } from "../../db";
import { codes } from "../../db/schema";
import { getCookie, createError } from "h3";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, "userId");
  if (!userId) throw createError({ statusCode: 401, statusMessage: "Не авторизован" });

  const codeId = Number(event.context.params?.id);
  const body = await readBody(event);
  const { code } = body;

  if (!code || !/^\d{4,}$/.test(code)) throw createError({ statusCode: 400, statusMessage: "Код должен быть числом минимум 4 символа" });

  await db.update(codes).set({ code }).where(eq(codes.id, codeId)).where(eq(codes.user_id, Number(userId)));

  return { success: true };
});
