<template>
  <div class="min-h-screen bg-gray-50 p-4 flex flex-col items-center">
    <!-- Заголовок -->
    <h1 class="text-3xl text-black font-bold text-center">Статистика кодов</h1>

    <!-- Средние показатели -->
    <div class="flex flex-col sm:flex-row gap-6  w-full justify-center flex-wrap">
      <va-card class="p-4 w-full sm:w-60 text-center shadow-lg">
        <Icon name="mdi:calendar-today" class="w-8 h-8 mx-auto mb-2 text-blue-500"/>
        <div class="text-xl font-semibold">{{ stats.today }}</div>
        <div class="text-gray-500">Среднее за день</div>
      </va-card>
      <va-card class="p-4 w-full sm:w-60 text-center shadow-lg">
        <Icon name="mdi:calendar-week" class="w-8 h-8 mx-auto mb-2 text-green-500"/>
        <div class="text-xl font-semibold">{{ stats.week }}</div>
        <div class="text-gray-500">Среднее за неделю</div>
      </va-card>
      <va-card class="p-4 w-full sm:w-60 text-center shadow-lg">
        <Icon name="mdi:calendar-month" class="w-8 h-8 mx-auto mb-2 text-purple-500"/>
        <div class="text-xl font-semibold">{{ stats.month }}</div>
        <div class="text-gray-500">Среднее за месяц</div>
      </va-card>
    </div>

    <!-- Список дней -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6 lg:grid-cols-4 gap-4 w-full max-w-6xl mb-6">
      <va-card
        v-for="day in days"
        :key="day.date"
        class="p-4 cursor-pointer hover:scale-105 transition-transform shadow-md"
        @click="openModal(day)"
      >
        <div class="text-center font-semibold">{{ day.date }}</div>
        <div class="text-gray-500 text-center">{{ day.count }} кодов</div>
      </va-card>
    </div>

    <!-- Модалка -->
    <va-modal v-model="modalVisible" :title="modalTitle" size="lg">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="border px-4 py-2">Код</th>
            <th class="border px-4 py-2">Время</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in modalCodes" :key="c.id" class="hover:bg-gray-50">
            <td class="border px-4 py-2 text-center font-mono">{{ c.code }}</td>
            <td class="border px-4 py-2 text-center">{{ c.time }}</td>
          </tr>
          <tr v-if="modalCodes.length === 0">
            <td colspan="2" class="border px-4 py-2 text-center text-gray-400">Нет кодов</td>
          </tr>
        </tbody>
      </table>
    </va-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vuestic-ui'

definePageMeta({ layout: 'user' })

const { notify } = useToast()

const stats = ref({ today: 0, week: 0, month: 0 })
const days = ref<{ date: string; count: number }[]>([])
const resDailyStats = ref<any[]>([])

// Модалка
const modalVisible = ref(false)
const modalTitle = ref('')
const modalCodes = ref<{ id: string; code: string; time: string }[]>([])

onMounted(async () => {
  try {
    const res = await $fetch("/api/codes/stats")
    resDailyStats.value = res.dailyStats

    stats.value.today = res.averages.day
    stats.value.week = res.averages.week
    stats.value.month = res.averages.month

    days.value = res.dailyStats.map((d: any) => ({
      date: d.date,
      count: d.count,
    }))
  } catch (err: any) {
    notify({ message: err.message || "Ошибка загрузки статистики", color: "danger" })
  }
})

const openModal = (day: { date: string; count: number }) => {
  modalTitle.value = `Коды за ${day.date}`

  const dayData = resDailyStats.value.find((d: any) => d.date === day.date)
  modalCodes.value = dayData ? dayData.codes.map((c: any) => ({ id: c.code + c.time, code: c.code, time: c.time })) : []

  modalVisible.value = true
}
</script>

<style scoped>
.va-card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.va-card:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}
</style>
