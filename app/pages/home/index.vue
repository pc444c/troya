<template>
  <div class="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b p-4">
    <UCard
      class="ucard-success w-full max-w-md backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl rounded-2xl p-0 overflow-hidden transition-all duration-500"
    >
      <!-- 🔹 Верхняя панель о создателе с анимацией -->
      <div
        class="creator-bar relative w-full px-4 py-2 flex items-center justify-center gap-2 shadow-md animate-fadeIn cursor-pointer"
        @click="celebrate"
      >
        <UIcon name="i-heroicons-user-circle" class="w-5 h-5 text-white drop-shadow" />
        <span class="text-sm font-medium text-white tracking-wide">
          Создатель:
          <span class="font-bold text-yellow-300 animate-pulse">PC_FIX</span>
        </span>
      </div>

      <!-- Контент карточки -->
      <div class="p-6">
        <!-- Заголовок -->
        <div class="flex flex-col items-center gap-3 mb-6">
          <div
            class="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md"
          >
            <UIcon name="i-heroicons-key" class="w-8 h-8 text-white" />
          </div>
          <h1 class="text-2xl font-bold text-white">Добавление кода</h1>
        </div>

        <!-- Логин -->
        <div class="text-center mb-3 text-gray-200">
          Вы вошли как:
          <span class="font-semibold text-xl text-white">{{ userLogin }}</span>
        </div>

        <!-- Статистика -->
        <div class="text-center mb-6 text-sm text-gray-300">
          Сегодня:
          <span class="text-white font-medium">{{ todayCount }}</span> |
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
      </div>
    </UCard>

    <!-- 🔹 Анимационный текст "PC FIX" -->
    <transition name="fade-scale">
      <div
        v-if="showText"
        class="absolute top-1/4 text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-600 drop-shadow-xl"
      >
        ✨ PC FIX ✨
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useToast } from "#imports"
import confetti from "canvas-confetti"

definePageMeta({ layout: "user" })

const toast = useToast()

const userLogin = ref<string>("...")
const code = ref("")
const todayCount = ref(0)
const totalCount = ref(0)
const showText = ref(false)

const onInput = (e: Event) => {
  const input = e.target as HTMLInputElement
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
  if (!code.value || code.value.length < 4 || !/^\d+$/.test(code.value) || code.value.length > 6) {
    toast.add({ title: "Введите код корректно", color: "error" })
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

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    })

    const card = document.querySelector(".ucard-success")
    if (card) {
      card.classList.add("ring-4", "ring-green-400", "shadow-green-500/50")
      setTimeout(() => {
        card.classList.remove("ring-4", "ring-green-400", "shadow-green-500/50")
      }, 1200)
    }
  } catch (err: any) {
    toast.add({ title: err.message || "Ошибка при сохранении кода", color: "error" })
  }
}

/* 🎉 Кликаем на панель создателя */
const celebrate = () => {
  // конфетти во все стороны
  confetti({
    particleCount: 200,
    spread: 120,
    origin: { y: 0.5 },
    colors: ["#facc15", "#60a5fa", "#ec4899", "#a855f7"],
  })

  // показать надпись PC FIX
  showText.value = true
  setTimeout(() => {
    showText.value = false
  }, 2000)
}
</script>

<style scoped>
/* 🔹 Анимация градиента для панели */
.creator-bar {
  background: linear-gradient(270deg, #4f46e5, #3b82f6, #9333ea);
  background-size: 600% 600%;
  animation: gradientMove 8s ease infinite;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 🔹 Плавное появление панели */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.8s ease forwards;
}

/* 🔹 Анимация текста PC FIX */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.8s ease;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.5);
}
.fade-scale-enter-to {
  opacity: 1;
  transform: scale(1.2);
}
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1.2);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
