<template>
  <div class="flex flex-col gap-6 min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <section class="flex flex-col items-center justify-center flex-1">
      <va-card class="w-full max-w-md shadow-lg rounded-2xl p-6">
        <!-- Заголовок -->
        <div class="flex flex-col items-center gap-2 mb-6">
          <Icon name="mdi:shield-key" class="text-blue-500 w-10 h-10" />
          <h1 class="text-2xl font-bold text-gray-800">Добавление кода</h1>
        </div>

        <!-- Отображение логина -->
        <div class="text-center mb-4 text-gray-700">
          Вы вошли как: <span class="font-semibold">{{ userLogin }}</span>
        </div>

        <!-- Статистика кодов -->
        <div class="text-center mb-4 text-gray-600">
          Коды сегодня: {{ todayCount }} | Всего кодов: {{ totalCount }}
        </div>

        <!-- Поле ввода кода -->
        <div class="flex flex-col gap-4">
          <va-input
            v-model="code"
            type="number"
            label="Код подтверждения"
            placeholder="Введите код"
            :rules="[v => !!v || 'Обязательное поле']"
          />

          <va-button class="w-full" color="primary" @click="submitCode">
            <Icon name="mdi:check-decagram" class="mr-2" />
            Сохранить код
          </va-button>
        </div>
      </va-card>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { useToast } from "vuestic-ui"

definePageMeta({
  layout: "user",
})

const { notify } = useToast()

// данные пользователя и кода
const userLogin = ref<string>("...")
const code = ref("")
const todayCount = ref(0)
const totalCount = ref(0)

// функция для загрузки статистики
const loadCounts = async () => {
  try {
    const res = await $fetch("/api/codes/today")
    todayCount.value = res.todayCount
    totalCount.value = res.totalCount
  } catch (err) {
    console.error("Ошибка загрузки статистики кодов:", err)
  }
}

// загружаем логин пользователя и статистику
onMounted(async () => {
  try {
    const res = await $fetch("/api/me")
    userLogin.value = res.user?.login || "Гость"
  } catch {
    userLogin.value = "Ошибка загрузки"
  }

  await loadCounts()
})

// сохранение кода
const submitCode = async () => {
  if (!code.value) {
    notify({ message: "Введите код", color: "warning" })
    return
  }

  try {
    const res = await $fetch("/api/codes", {
      method: "POST",
      body: { code: code.value },
    })

    notify({ message: res.message, color: "success", duration: 2000 })

    code.value = ""      // очищаем поле
    await loadCounts()   // обновляем статистику
  } catch (err: any) {
    notify({ message: err.message || "Ошибка при сохранении кода", color: "danger" })
  }
}
</script>

<style scoped>
section {
  @apply flex justify-center items-center;
}
</style>
