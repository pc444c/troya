import { db } from "../../../db"
import { codes, users } from "../../../db/schema"
import { gte, lte, eq } from "drizzle-orm"
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"
import { sql } from "drizzle-orm"

export default defineEventHandler(async () => {
  try {
    const todayStart = startOfDay(new Date())
    const todayEnd = endOfDay(new Date())
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }) // Пн
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
    const monthStart = startOfMonth(new Date())
    const monthEnd = endOfMonth(new Date())

    // Получаем всех пользователей
    const allUsers = await db.select().from(users)

    // Считаем количество кодов для каждого пользователя
    const stats = await Promise.all(allUsers.map(async (u) => {
      // total
      const [totalRow] = await db.select({ count: sql<number>`COUNT(*)` })
        .from(codes)
        .where(eq(codes.user_id, u.id))
      const total = totalRow?.count ?? 0

      // today
      const [todayRow] = await db.select({ count: sql<number>`COUNT(*)` })
        .from(codes)
        .where(
          eq(codes.user_id, u.id),
          gte(codes.created_at, todayStart),
          lte(codes.created_at, todayEnd)
        )
      const today = todayRow?.count ?? 0

      // week
      const [weekRow] = await db.select({ count: sql<number>`COUNT(*)` })
        .from(codes)
        .where(
          eq(codes.user_id, u.id),
          gte(codes.created_at, weekStart),
          lte(codes.created_at, weekEnd)
        )
      const week = weekRow?.count ?? 0

      // month
      const [monthRow] = await db.select({ count: sql<number>`COUNT(*)` })
        .from(codes)
        .where(
          eq(codes.user_id, u.id),
          gte(codes.created_at, monthStart),
          lte(codes.created_at, monthEnd)
        )
      const month = monthRow?.count ?? 0

      return {
        id: u.id,
        login: u.login,
        today,
        week,
        month,
        total
      }
    }))

    // Сортируем по total по возрастанию
    stats.sort((a, b) => a.total - b.total)

    return { users: stats }
  } catch (err: any) {
    return { error: err.message }
  }
})