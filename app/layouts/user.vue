<template>
  <div class="min-h-screen text-neutral-200 flex flex-col gap-4 relative">
    <!-- Header -->

    <!-- Кнопка выхода -->


    <!-- Кнопки навигации -->
    <div class="flex flex-col sm:flex-row  justify-between p-4 gap-3 sm:gap-4 flex-wrap">
      <div>
        <ExitAccount />
      </div>
      <div class="flex flex-row gap-4">
        <!-- Добавить код -->
        <UButton variant="soft" color="gray" size="lg" class="rounded-full nav-btn"
          :class="{ 'active-btn': route.path === '/home' }" @click="goTo('/home')">
          <UIcon name="i-heroicons-plus" class="w-5 h-5 mr-2" />
          Добавить код
        </UButton>
        <!--  -->
          <UButton variant="soft" color="gray" size="lg" class="rounded-full nav-btn"
          :class="{ 'active-btn': route.path === '/home/kody' }" @click="goTo('/home/kody')">
          <UIcon name="i-heroicons-bug-ant" class="w-5 h-5 mr-2" />
          Пробив регион
        </UButton>
        <!--  -->
        <UButton variant="soft" color="gray" size="lg" class="rounded-full nav-btn"
          :class="{ 'active-btn': route.path === '/home/profile' }" @click="goTo('/home/profile')">
          <UIcon name="i-heroicons-cog" class="w-5 h-5 mr-2" />
          Настройки
        </UButton>
        <!-- Общая статистика -->
        <UButton variant="soft" color="gray" size="lg" class="rounded-full nav-btn"
          :class="{ 'active-btn': route.path === '/stats/all' }" @click="goTo('/stats/all')">
          <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 mr-2" />
          Общая статистика
        </UButton>

        <!-- Моя статистика -->
        <UButton variant="soft" color="gray" size="lg" class="rounded-full nav-btn"
          :class="{ 'active-btn': route.path === '/stats' }" @click="goTo('/stats')">
          <UIcon name="i-heroicons-chart-pie" class="w-5 h-5 mr-2" />
          Моя статистика
        </UButton>
      </div>
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
</script>

<style scoped>
/* hover эффект для всех кнопок */
.nav-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  transition: background-color 0.2s ease;
}

/* активная кнопка */
.active-btn {
  background-color: rgba(59, 130, 246, 0.2) !important;
  /* синий оттенок */
  border: 1px solid rgba(59, 130, 246, 0.5);
  color: #60a5fa !important;
  /* text-blue-400 */
}
</style>
