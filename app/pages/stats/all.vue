<template>
  <div class="min-h-screen bg-gray-900 p-6 text-gray-100">
    <!-- Заголовок -->
    <div class="text-center mb-10">
      <h1 class="text-3xl md:text-4xl font-bold mb-2">Общая статистика пользователей</h1>
      <p class="text-gray-400 mt-2">Аналитика активности по дням, неделям и месяцам</p>
    </div>

    <!-- Таблица пользователей -->
    <div class="max-w-6xl mx-auto bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-md overflow-x-auto">
      <table class="w-full min-w-[600px] border-collapse text-gray-100">
        <thead>
          <tr class="bg-gray-700 text-gray-200">
            <th class="px-4 py-3 text-left rounded-tl-lg">Пользователь</th>
            <th class="px-4 py-3 text-center">Сегодня</th>
            <th class="px-4 py-3 text-center">Неделя</th>
            <th class="px-4 py-3 text-center">Месяц</th>
            <th class="px-4 py-3 text-center rounded-tr-lg">Всего</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr v-for="user in usersStats" :key="user.id" class="hover:bg-gray-700 transition-colors">
            <td class="px-4 py-3 font-medium">{{ user.login }}</td>
            <td class="px-4 py-3 text-center font-semibold text-blue-400">{{ user.today }}</td>
            <td class="px-4 py-3 text-center font-semibold text-green-400">{{ user.week }}</td>
            <td class="px-4 py-3 text-center font-semibold text-purple-400">{{ user.month }}</td>
            <td class="px-4 py-3 text-center font-bold text-indigo-400">{{ user.total }}</td>
          </tr>
          <tr v-if="usersStats.length === 0">
            <td colspan="5" class="text-center py-6 text-gray-500">
              Нет данных
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Кнопка обновления -->
    <div class="mt-8 text-center">
      <UButton
        color="primary"
        size="lg"
        icon="i-heroicons-arrow-path"
        class="!rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all"
        :loading="isLoading"
        @click="fetchStats"
      >
        Обновить статистику
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '#imports'

definePageMeta({ layout: 'user' })

const toast = useToast()
const isLoading = ref(false)

type UserStats = {
  id: number
  login: string
  today: number
  week: number
  month: number
  total: number
}

const usersStats = ref<UserStats[]>([])

const fetchStats = async () => {
  try {
    isLoading.value = true
    const res = await $fetch("/api/codes/stats/all")
    if (res.error) throw new Error(res.error)

    usersStats.value = (res.users || []).map((u: any) => ({
      id: u.id,
      login: u.login,
      today: Number(u.today),
      week: Number(u.week),
      month: Number(u.month),
      total: Number(u.total)
    }))
  } catch (err: any) {
    toast.add({ title: err.message || "Ошибка загрузки статистики", color: "red" })
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchStats)
</script>

<style scoped>
/* Hover эффект для строк */
tbody tr:hover {
  background-color: #374151; /* gray-700 */
  transition: background-color 0.2s;
}

/* Скроллбар для таблицы */
::-webkit-scrollbar {
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #1f2937; /* gray-800 */
  border-radius: 3px;
}
::-webkit-scrollbar-thumb {
  background: #3b82f6; /* blue-500 */
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #2563eb; /* blue-600 */
}
</style>
