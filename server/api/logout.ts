export default defineEventHandler(async (event) => {
  deleteCookie(event, "userId")

  return { message: "Вы вышли из аккаунта" }
})
