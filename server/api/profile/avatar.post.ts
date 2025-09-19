import { db } from "../../db"
import { users } from "../../db/schema"
import { getCookie, createError } from "h3"
import { eq } from "drizzle-orm"

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, "userId")
  if (!userId) throw createError({ statusCode: 401, message: "Не авторизован" })

  const body = await readBody<{ avatarUrl: string }>(event)
  if (!body?.avatarUrl) throw createError({ statusCode: 400, message: "Ссылка на аватар обязательна" })

  await db.update(users).set({ avatarUrl: body.avatarUrl }).where(eq(users.id, Number(userId)))

  return { message: "Аватар обновлен" }
})
