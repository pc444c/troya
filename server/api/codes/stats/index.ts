import { db } from "../../../db";
import { codes } from "../../../db/schema";
import { getCookie, createError } from "h3";
import { eq, desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, "userId");
  if (!userId)
    throw createError({ statusCode: 401, statusMessage: "Не авторизован" });

  // Получаем все коды пользователя, сортировка по дате
  const allCodes = await db
    .select()
    .from(codes)
    .where(eq(codes.user_id, Number(userId)))
    .orderBy(desc(codes.created_at));

  if (!allCodes.length)
    return { dailyStats: [], totals: { day: 0, week: 0, month: 0 } };

  // Группировка по дате
  const statsMap = new Map<string, { codes: typeof allCodes }>();
  allCodes.forEach((c) => {
    const date = c.created_at.toISOString().split("T")[0]; // YYYY-MM-DD
    if (!statsMap.has(date)) statsMap.set(date, { codes: [] });
    statsMap.get(date)!.codes.push(c);
  });

  const dailyStats = Array.from(statsMap.entries()).map(([date, data]) => ({
    date,
    count: data.codes.length,
    codes: data.codes.map((c) => ({
      code: c.code,
      time: c.created_at.toISOString().split("T")[1].split(".")[0], // HH:MM:SS
    })),
  }));

  // Подсчёт за день / неделю / месяц
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  // За день
  const dayCount = dailyStats.find((d) => d.date === todayStr)?.count || 0;

  // За неделю
  const weekStart = new Date();
  weekStart.setDate(now.getDate() - 7);
  const weekCount = dailyStats
    .filter((d) => d.date >= weekStart.toISOString().split("T")[0])
    .reduce((acc, d) => acc + d.count, 0);

  // За месяц
  const monthStart = new Date();
  monthStart.setMonth(now.getMonth() - 1);
  const monthCount = dailyStats
    .filter((d) => d.date >= monthStart.toISOString().split("T")[0])
    .reduce((acc, d) => acc + d.count, 0);

  return {
    dailyStats,
    totals: {
      day: dayCount,
      week: weekCount,
      month: monthCount,
    },
  };
});
