import { db } from "../db"
import { users } from "../db/schema"
import { getCookie, createError } from "h3"
import { eq } from "drizzle-orm"

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, "userId")
  if (!userId) throw createError({ statusCode: 401, message: "Не авторизован" })

  const result = await db.select().from(users).where(eq(users.id, Number(userId)))
  const user = result.length > 0 ? result[0] : null
  if (!user) throw createError({ statusCode: 404, message: "Пользователь не найден" })

  return {
    user: {
      login: user.login,
      avatarUrl: user.avatarUrl || "",
      createdAt: user.created_at
    }
  }
})
