<template>
  <div class="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b  p-4">
    <UCard
      class="w-full max-w-md backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl rounded-2xl p-6"
    >
      <!-- Заголовок -->
      <div class="flex flex-col items-center gap-3 mb-6">
        <div class="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md">
          <UIcon name="i-heroicons-key" class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-white">Добавление кода</h1>
      </div>

      <!-- Логин -->
      <div class="text-center mb-3 text-gray-200">
        Вы вошли как: <span class="font-semibold text-xl text-white">{{ userLogin }}</span>
      </div>

      <!-- Статистика -->
      <div class="text-center mb-6 text-sm text-gray-300">
        Сегодня: <span class="text-white font-medium">{{ todayCount }}</span> |
        Всего: <span class="text-white font-medium">{{ totalCount }}</span>
      </div>

      <!-- Форма -->
      <UForm :state="{ code }" @submit="submitCode" class="flex flex-col gap-5">
        <UFormGroup label="Код подтверждения" name="code" required>
          <UInput
            v-model="code"
            type="text"
            placeholder="Введите код"
            @input="onInput"
            icon="i-heroicons-hashtag"
            size="lg"
            class="backdrop-blur block rounded-md bg-white/20 border-white/30 text-white placeholder-gray-300"
          />
        </UFormGroup>

        <UButton
          type="submit"
          color="primary"
          size="lg"
          block
          class="!rounded-xl !py-3 font-semibold shadow-lg hover:shadow-blue-500/25 transition-all"
        >
          <template #leading>
            <UIcon name="i-heroicons-check-badge" class="w-5 h-5" />
          </template>
          Сохранить код
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useToast } from "#imports"

definePageMeta({ layout: "user" })

const toast = useToast()

const userLogin = ref<string>("...")
const code = ref("")
const todayCount = ref(0)
const totalCount = ref(0)
const onInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  // Убираем все, кроме цифр, и обрезаем до 6 символов
  input.value = input.value.replace(/\D/g, "").slice(0, 6)
  code.value = input.value
}


const loadCounts = async () => {
  try {
    const res = await $fetch("/api/codes/today")
    todayCount.value = res.todayCount
    totalCount.value = res.totalCount
  } catch (err) {
    console.error("Ошибка загрузки статистики кодов:", err)
  }
}

onMounted(async () => {
  try {
    const res = await $fetch("/api/me")
    userLogin.value = res.user?.login || "Гость"
  } catch {
    userLogin.value = "Ошибка загрузки"
  }
  await loadCounts()
})

const submitCode = async () => {
  if (!code.value || code.value.length < 4 || !/^\d+$/.test(code.value) || code.value.length > 6 ){
    toast.add({ title: "Введите код коректно", color: "error" })
    return
  }

  try {
    const res = await $fetch("/api/codes", {
      method: "POST",
      body: { code: code.value },
    })

    toast.add({ title: res.message, color: "primary" })
    code.value = ""
    await loadCounts()
  } catch (err: any) {
    toast.add({ title: err.message || "Ошибка при сохранении кода", color: "error" })
  }
}
</script>
