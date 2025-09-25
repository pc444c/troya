import { db } from "../../db";
import { codes } from "../../db/schema";
import { getCookie, createError } from "h3";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, "userId");
  if (!userId) throw createError({ statusCode: 401, statusMessage: "Не авторизован" });

  const codeIdParam = event.context.params?.id;
  if (!codeIdParam) throw createError({ statusCode: 400, statusMessage: "Не указан ID кода" });

  const codeId = Number(codeIdParam);
  if (isNaN(codeId)) throw createError({ statusCode: 400, statusMessage: "Некорректный ID кода" });

  const result = await db.delete(codes).where(
    and(
      eq(codes.id, codeId),
      eq(codes.user_id, Number(userId))
    )
  );

  return { success: true, deletedCount: result.rowCount ?? 0 };
});
