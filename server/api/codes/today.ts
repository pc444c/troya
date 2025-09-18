import { db } from "../../db";
import { codes } from "../../db/schema";
import { getCookie } from "h3";
import { eq, gte, lt, and, } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, "userId");
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Не авторизован",
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Количество кодов за сегодня
  const codesToday = await db
    .select()
    .from(codes)
    .where(
      and(
        eq(codes.user_id, Number(userId)),
        gte(codes.created_at, today),
        lt(codes.created_at, tomorrow)
      )
    );

  // Общее количество кодов
  const totalCodes = await db
    .select()
    .from(codes)
    .where(eq(codes.user_id, Number(userId)));

  return {
    todayCount: codesToday.length,
    totalCount: totalCodes.length,
  };
});
