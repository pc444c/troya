<template>
  <div class="flex flex-col gap-6 min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <!-- Контейнер формы -->
    <section class="flex flex-col items-center justify-center flex-1">
      <va-card class="w-full max-w-md shadow-lg rounded-2xl p-6">
        <!-- Заголовок -->
        <div class="flex items-center justify-center gap-2 mb-6">
          <Icon name="mdi:account-lock" class="text-blue-500 w-8 h-8" />
          <h1 class="text-2xl font-bold text-gray-800">
            Вход / Регистрация
          </h1>
        </div>

        <!-- Форма -->
        <div class="flex flex-col gap-4">
          <va-input
            v-model="form.login"
            label="Логин"
            placeholder="Введите логин"
            :rules="[v => !!v || 'Обязательное поле']"
          />
          <va-input
            v-model="form.password"
            label="Пароль"
            placeholder="Введите пароль"
            type="password"
            :rules="[v => !!v || 'Обязательное поле']"
          />
          <va-button class="w-full" color="primary" @click="submitForm">
            <Icon name="mdi:login" class="mr-2" />
            Продолжить
          </va-button>
        </div>
      </va-card>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { useToast } from 'vuestic-ui'
 const { notify } = useToast()
const form = ref({
  login: "",
  password: "",
});


const submitForm = async () => {
  if (!form.value.login || !form.value.password) {
  notify({ message: "Заполните все поля", color: "warning" });
    return;
  }

  try {
    const data = await $fetch("/api/auth", {
      method: "POST",
      body: {
        login: form.value.login,
        password: form.value.password,
      },
    });

    notify({ message: (data as any).message, color: "success" });

    // редирект после короткой задержки
    setTimeout(() => window.location.href = "/home", 800);

  } catch (err: any) {
   vaToast.notify({ message: err.message || "Ошибка запроса", color: "danger" });
  }
};

</script>

<style scoped>
section {
  @apply flex justify-center items-center;
}
</style>
