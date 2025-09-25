<template>
  <div class="min-h-screen flex items-center justify-center bg-transparent p-4">
    <UCard class="w-full max-w-sm backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl rounded-2xl">
      <!-- Заголовок -->
      <div class="text-center space-y-2 mb-8">
        <UIcon name="i-heroicons-lock-closed" class="w-12 h-12 text-white mx-auto drop-shadow" />
        <h1 class="text-2xl font-semibold text-white">Вход</h1>
        <p class="text-sm text-gray-200">Введите логин и пароль</p>
      </div>

      <!-- Форма -->
      <UForm :state="form" @submit="submitForm" class="flex flex-col gap-3">
        <UFormGroup label="Логин" name="login" required>
          <UInput
            v-model="form.login"
            name="username"
            autocomplete="username"
            placeholder="Ваш логин"
            icon="i-heroicons-user"
            size="lg"
            class="block rounded-md bg-white/20 border-white/30 text-white"
          />
        </UFormGroup>

        <UFormGroup label="Пароль" name="password" required>
          <UInput
            v-model="form.password"
            name="current-password"
            autocomplete="current-password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Ваш пароль"
            icon="i-heroicons-key"
            size="lg"
            class="block rounded-md bg-white/20 border-white/30 text-white"
          >
            <template #trailing>
              <UButton
                variant="ghost"
                color="neutral"
                size="xs"
                :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                @click="showPassword = !showPassword"
                class="!p-1"
              />
            </template>
          </UInput>
        </UFormGroup>

        <UButton
          type="submit"
          color="primary"
          size="lg"
          block
          :loading="loading"
          :disabled="loading"
          icon="i-heroicons-arrow-right-on-rectangle"
          class="!rounded-xl !py-3 font-semibold shadow-lg"
        >
          {{ loading ? "Загрузка..." : "Войти" }}
        </UButton>
      </UForm>

      <p class="mt-6 text-xs text-gray-200 text-center">
        Если аккаунта нет — можно зарегистрироваться
      </p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "#imports";

const toast = useToast();
const loading = ref(false);
const showPassword = ref(false);

const form = ref({
  login: "",
  password: ""
});

const submitForm = async () => {
  if (!form.value.login || !form.value.password) {
    toast.add({ title: "Заполните все поля", color: "secondary", icon: "i-heroicons-exclamation-triangle" });
    return;
  }

  loading.value = true;

  try {
    const data = await $fetch("/api/auth", {
      method: "POST",
      body: form.value
    });

    if (data.requireRegistration) {
      const confirmed = confirm("Пользователь не найден. Создать новый аккаунт?");
      if (!confirmed) return;

      // Создаём нового пользователя
      const registerData = await $fetch("/api/register", {
        method: "POST",
        body: form.value
      });

      toast.add({ title: registerData.message, color: "primary", icon: "i-heroicons-check-circle" });
      setTimeout(() => window.location.href = "/home", 800);
      return;
    }

    // Вход успешен
    toast.add({ title: data.message, color: "primary", icon: "i-heroicons-check-circle" });
    setTimeout(() => window.location.href = "/home", 800);

  } catch (err: any) {
    toast.add({ title: err.data?.statusMessage || "Ошибка входа", color: "error", icon: "i-heroicons-x-circle" });
  } finally {
    loading.value = false;
  }
};
</script>
