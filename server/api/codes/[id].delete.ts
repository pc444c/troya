import { db } from "../../db";
import { codes } from "../../db/schema";
import { getCookie, createError } from "h3";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, "userId");
  if (!userId) throw createError({ statusCode: 401, statusMessage: "Не авторизован" });

  const codeId = Number(event.context.params?.id);

  await db.delete(codes).where(eq(codes.id, codeId)).where(eq(codes.user_id, Number(userId)));

  return { success: true };
});
