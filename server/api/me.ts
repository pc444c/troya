import { db } from "../db";
import { users } from "../db/schema";
import { getCookie } from "h3";
import { eq } from "drizzle-orm"; // <- добавь этот импорт
export default defineEventHandler(async (event) => {
  const userId = getCookie(event, "userId");
  if (!userId) return { user: null };

  const [user] = await db.select().from(users).where(eq(users.id, Number(userId)));
  if (!user) return { user: null };

  return { user: { id: user.id, login: user.login } };
});
