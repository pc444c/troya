<template>
  <div class="min-h-screen text-neutral-200 flex flex-col gap-4 relative">
    <!-- Header -->
    <UHeader @click="BackHome" />

    <!-- Кнопка выхода -->
  <ExitAccount/>

    <!-- Кнопки навигации -->
    <div class="flex flex-col sm:flex-row justify-end p-4 gap-3 sm:gap-4 flex-wrap">
      <!-- Добавить код -->
      <UButton
        :class="buttonClass('/home')"
        color="blue"
        class="shadow-lg px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center justify-center w-full sm:w-auto"
        @click="goTo('/home')"
      >
        <UIcon name="i-heroicons-plus" class="w-5 h-5 mr-2" />
        Добавить код
      </UButton>

      <!-- Общая статистика -->
      <UButton
        :class="buttonClass('/stats')"
        color="blue"
        class="shadow-lg px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center justify-center w-full sm:w-auto"
        @click="goTo('/stats')"
      >
        <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 mr-2" />
        Общая статистика
      </UButton>

      <!-- Моя статистика -->
      <UButton
        :class="buttonClass('/stats/all')"
        color="blue"
        class="shadow-lg px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center justify-center w-full sm:w-auto"
        @click="goTo('/stats/all')"
      >
        <UIcon name="i-heroicons-chart-pie" class="w-5 h-5 mr-2" />
        Моя статистика
      </UButton>
    </div>

    <!-- Контент -->
    <div class="p-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from '#imports'

const router = useRouter()
const route = useRoute()

const goTo = (path: string) => router.push(path)
const BackHome = () => router.push("/home")

// Функция возвращает класс для подсветки активной кнопки
const buttonClass = (path: string) => {
  return route.path === path ? 'bg-white/20' : ''
}
</script>

<style scoped>
/* Подсветка кнопки: при активном пути добавляем немного blur и цвет */
.bg-white\/20 {
  backdrop-filter: blur(6px);
  background-color: rgba(255, 255, 255, 0.2) !important;
}
</style>
