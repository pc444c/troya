export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data } = await useFetch("/api/me");

  const user = data.value?.user;

  // Разрешаем доступ к странице логина/регистрации только неавторизованным
  if ((to.path === "/" || to.path === "/register") && user) {
    return navigateTo("/home"); // если авторизован, сразу на /home
  }

  // Защищаем остальные страницы
  if (to.path !== "/" && to.path !== "/register" && !user) {
    return navigateTo("/"); // если не авторизован, редирект на логин
  }

  // иначе всё ок, пропускаем
});
