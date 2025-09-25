import { db } from "../../../db";
import { codes } from "../../../db/schema";
import { getCookie, createError } from "h3";
import { eq, desc } from "drizzle-orm";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, "userId");
  if (!userId)
    throw createError({ statusCode: 401, statusMessage: "Не авторизован" });

  // Все коды пользователя
  const allCodes = await db
    .select()
    .from(codes)
    .where(eq(codes.user_id, Number(userId)))
    .orderBy(desc(codes.created_at));

  if (!allCodes.length) {
    return {
      dailyStats: [],
      totals: { day: 0, week: 0, month: 0 },
      averages: { week: 0, month: 0 },
    };
  }

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
      id: c.id, // добавляем ID
      code: c.code,
      time: c.created_at.toISOString().split("T")[1].split(".")[0], // HH:MM:SS
    })),
  }));

  // Подсчёты
  const now = new Date();

  // День
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const dayCount = allCodes.filter(
    (c) => c.created_at >= todayStart && c.created_at <= todayEnd
  ).length;

  // Неделя
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const weekCodes = allCodes.filter(
    (c) => c.created_at >= weekStart && c.created_at <= weekEnd
  );
  const weekCount = weekCodes.length;

  // Месяц
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const monthCodes = allCodes.filter(
    (c) => c.created_at >= monthStart && c.created_at <= monthEnd
  );
  const monthCount = monthCodes.length;

  // Средние значения
  const weekAvg = weekCount / 7;
  const monthAvg = monthCount / 30;

  return {
    dailyStats,
    totals: {
      day: dayCount,
      week: weekCount,
      month: monthCount,
    },
    averages: {
      week: weekAvg,
      month: monthAvg,
    },
  };
});
