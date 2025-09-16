<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 flex flex-col items-center">
    <!-- Заголовок -->
    <h1 class="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
      Общая статистика пользователей
    </h1>

    <!-- Таблица -->
    <div class="w-full max-w-6xl overflow-x-auto">
      <table class="w-full table-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <thead class="bg-blue-100">
          <tr>
            <th class="px-4 py-3 text-left text-blue-800 font-semibold">Пользователь</th>
            <th class="px-4 py-3 text-center text-blue-800 font-semibold">Сегодня</th>
            <th class="px-4 py-3 text-center text-blue-800 font-semibold">Неделя</th>
            <th class="px-4 py-3 text-center text-blue-800 font-semibold">Месяц</th>
            <th class="px-4 py-3 text-center text-blue-800 font-semibold">Всего</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in usersStats"
            :key="user.id"
            class="transition-colors hover:bg-blue-50 cursor-pointer"
          >
            <td class="border-t px-4 py-3 font-medium text-gray-700">{{ user.login }}</td>
            <td class="border-t px-4 py-3 text-center text-gray-700">{{ user.today }}</td>
            <td class="border-t px-4 py-3 text-center text-gray-700">{{ user.week }}</td>
            <td class="border-t px-4 py-3 text-center text-gray-700">{{ user.month }}</td>
            <td class="border-t px-4 py-3 text-center font-bold text-gray-800">{{ user.total }}</td>
          </tr>

          <!-- Если данных нет -->
          <tr v-if="usersStats.length === 0">
            <td colspan="5" class="border-t px-4 py-4 text-center text-gray-400">
              Нет данных
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Кнопка обновления -->
    <div class="mt-6">
      <va-button color="primary" @click="fetchStats">
        Обновить статистику
      </va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vuestic-ui'

definePageMeta({ layout: 'user' })

const { notify } = useToast()

type UserStats = {
  id: number
  login: string
  today: number
  week: number
  month: number
  total: number
}

const usersStats = ref<UserStats[]>([])

// Функция загрузки статистики
const fetchStats = async () => {
  try {
    const res = await $fetch("/api/codes/stats/all")
    if (res.users) {
      usersStats.value = res.users
    }
  } catch (err: any) {
    notify({ message: err.message || "Ошибка загрузки статистики", color: "danger" })
  }
}

// Загружаем при монтировании
onMounted(fetchStats)
</script>

<style scoped>
/* Адаптивное отображение для мобильных */
@media (max-width: 768px) {
  table th, table td {
    padding: 0.5rem;
  }
  h1 {
    font-size: 1.75rem;
  }
}

/* Плавный hover */
tr {
  transition: background-color 0.3s;
}
</style>
