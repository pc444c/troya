import { db } from "../../db"
import { users } from "../../db/schema"
import { getCookie, createError } from "h3"
import { eq } from "drizzle-orm"

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, "userId")
  if (!userId) return { message: "Не авторизован" }

  const body = await readBody<{ login: string }>(event)
  const newLogin = body?.login?.trim() || ""

  // Проверка на пустой логин
  if (!newLogin) return { message: "Логин не может быть пустым" }

  // Проверка длины логина
  if (newLogin.length > 32) return { message: "Логин не может быть длиннее 32 символов" }

  // Проверка уникальности
  const exists = await db.select().from(users).where(eq(users.login, newLogin))
  if (exists.length > 0) return { message: "Такой логин уже занят, выбери другой" }

  // Обновление логина
  await db.update(users)
    .set({ login: newLogin })
    .where(eq(users.id, Number(userId)))

  return { message: "Логин обновлен" }
})
