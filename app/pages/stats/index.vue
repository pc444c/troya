<template>
  <div class="min-h-screen bg-gray-900 p-6 text-gray-100">
    <!-- Заголовок -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold mb-2">📊 Статистика кодов</h1>
      <p class="text-gray-400 text-lg">Анализ вашей активности по времени</p>
    </div>

    <!-- Карточки с метриками -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto mb-8">
      <UCard class="p-6 bg-gray-800 border border-gray-700 shadow-md">
        <div class="flex items-center justify-center w-12 h-12 bg-blue-700 rounded-lg mb-4 mx-auto">
          <UIcon name="i-heroicons-calendar-days" class="w-6 h-6 text-white" />
        </div>
        <div class="text-2xl font-bold text-white text-center mb-2">{{ stats.today }}</div>
        <div class="text-blue-400 text-center font-semibold">Сегодня</div>
        <div class="text-gray-400 text-sm text-center mt-1">кодов</div>
      </UCard>

      <UCard class="p-6 bg-gray-800 border border-gray-700 shadow-md">
        <div class="flex items-center justify-center w-12 h-12 bg-green-700 rounded-lg mb-4 mx-auto">
          <UIcon name="i-heroicons-calendar" class="w-6 h-6 text-white" />
        </div>
        <div class="text-2xl font-bold text-white text-center mb-1">{{ stats.week }}</div>
        <div class="text-green-400 text-center font-semibold">За неделю</div>
        <div class="text-gray-400 text-sm text-center mt-1">всего кодов</div>
        <div class="text-xs text-gray-500 text-center mt-1">среднее: {{ stats.weekAvg.toFixed(1) }}/день</div>
      </UCard>

      <UCard class="p-6 bg-gray-800 border border-gray-700 shadow-md">
        <div class="flex items-center justify-center w-12 h-12 bg-purple-700 rounded-lg mb-4 mx-auto">
          <UIcon name="i-heroicons-calendar" class="w-6 h-6 text-white" />
        </div>
        <div class="text-2xl font-bold text-white text-center mb-1">{{ stats.month }}</div>
        <div class="text-purple-400 text-center font-semibold">За месяц</div>
        <div class="text-gray-400 text-sm text-center mt-1">всего кодов</div>
        <div class="text-xs text-gray-500 text-center mt-1">среднее: {{ stats.monthAvg.toFixed(1) }}/день</div>
      </UCard>
    </div>

    <!-- Таблица по дням -->
    <div class="max-w-6xl mx-auto bg-gray-800 border border-gray-700 shadow-md rounded-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold">📅 Детализация по дням</h2>
        <div class="text-gray-400 text-sm">Всего дней: {{ days.length }}</div>
      </div>

      <div v-if="days.length === 0" class="text-center py-12">
        <UIcon name="i-heroicons-document-magnifying-glass" class="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p class="text-gray-300 text-lg mb-2">Нет данных за выбранный период</p>
        <p class="text-gray-400">Начните добавлять коды, чтобы увидеть статистику</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full rounded-lg overflow-hidden text-gray-100">
          <thead class="bg-gray-700">
            <tr>
              <th class="text-left font-semibold px-4 py-3">Дата</th>
              <th class="text-left font-semibold px-4 py-3">Количество кодов</th>
              <th class="text-left font-semibold px-4 py-3">Действия</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="(row, index) in days" :key="index" class="hover:bg-gray-700 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-blue-400 mr-2" />
                  <span class="font-medium">{{ formatDate(row.date) }}</span>
                </div>
              </td>
              <td class="px-4 py-3 font-semibold">{{ row.count }}</td>
              <td class="px-4 py-3">
                <UModal :title="`Коды за ${formatDate(row.date)}`">
                  <UButton label="Открыть" color="neutral" variant="subtle" @click="openModal(row)" />
                  <template #body>
                    <div v-if="modalCodes.length === 0" class="text-center py-8">
                      <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p class="text-gray-300">Нет кодов за этот день</p>
                    </div>
                    <div v-else class="max-h-96 overflow-y-auto">
                      <table class="w-full text-left">
                        <thead class="bg-gray-700">
                          <tr>
                            <th class="px-4 py-3 font-semibold">Код</th>
                            <th class="px-4 py-3 font-semibold">Время</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-700">
                          <tr v-for="(item, idx) in modalCodes" :key="idx">
                            <td class="px-4 py-3">
                              <code class="font-mono px-2 py-1 rounded bg-gray-700 text-blue-400">{{ item.code }}</code>
                            </td>
                            <td class="px-4 py-3 flex items-center">
                              <UIcon name="i-heroicons-clock" class="w-4 h-4 text-green-400 mr-2" />
                              <span class="text-green-300">{{ item.time }}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </template>
                </UModal>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '#imports'

definePageMeta({ layout: 'user' })

const toast = useToast()
const stats = ref({ today: 0, week: 0, month: 0, weekAvg: 0, monthAvg: 0 })
const days = ref<any[]>([])
const modalCodes = ref<{ code: string; time: string }[]>([])

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })

onMounted(async () => {
  try {
    const res = await $fetch("/api/codes/stats")
    stats.value = {
      today: res.totals?.day ?? 0,
      week: res.totals?.week ?? 0,
      month: res.totals?.month ?? 0,
      weekAvg: res.averages?.week ?? 0,
      monthAvg: res.averages?.month ?? 0,
    }
    days.value = (res.dailyStats || []).map((d: any) => ({
      date: d.date,
      count: d.count,
      codes: d.codes || []
    }))
  } catch (err: any) {
    toast.add({ title: err.message || "Ошибка загрузки статистики", color: "red" })
  }
})

const openModal = (row: any) => {
  modalCodes.value = row.codes || []
}
</script>
