<template>
  <div class="min-h-screen bg-gray-900 p-6 text-gray-100">
    <!-- Заголовок -->
    <div class="text-center mb-10">
      <h1 class="text-3xl md:text-4xl font-bold mb-2">Общая статистика пользователей</h1>
      <p class="text-gray-400 mt-2">Аналитика активности по дням, неделям и месяцам</p>
    </div>
    
    <!-- Карточки метрик -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-6">
      <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-md text-center">
        <div class="text-blue-400 text-2xl md:text-3xl font-bold">{{ animatedTotals.today }}</div>
        <p class="text-gray-400 mt-1">Всего за сегодня</p>
      </div>
      <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-md text-center">
        <div class="text-green-400 text-2xl md:text-3xl font-bold">{{ animatedTotals.week }}</div>
        <p class="text-gray-400 mt-1">Всего за неделю</p>
      </div>
      <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-md text-center">
        <div class="text-purple-400 text-2xl md:text-3xl font-bold">{{ animatedTotals.month }}</div>
        <p class="text-gray-400 mt-1">Всего за месяц</p>
      </div>
      <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-md text-center">
        <div class="text-pink-400 text-2xl md:text-3xl font-bold">{{ animatedUserCount }}</div>
        <p class="text-gray-400 mt-1">Всего пользователей</p>
      </div>
    </div>

    <!-- Переключатель периода для ТОП -->
    <div class="max-w-6xl mx-auto mb-6 flex justify-center gap-2">
      <UButton
        v-for="tab in tabs"
        :key="tab.value"
        :variant="activeTab === tab.value ? 'solid' : 'outline'"
        color="primary"
        size="sm"
        class="!rounded-xl flex items-center gap-1"
        @click="activeTab = tab.value"
      >
        <UIcon :name="tab.icon" class="w-4 h-4"/>
        {{ tab.label }}
      </UButton>
    </div>

    <!-- ТОП-3 -->
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div
        v-for="(group, i) in topGroups"
        :key="i"
        class="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-md"
      >
        <h2 class="text-lg font-semibold text-center mb-4 text-gray-200">
          Топ {{ i + 1 }} ({{ tabLabel }})
        </h2>
        <ul class="space-y-2">
          <li
            v-for="(user, idx) in group"
            :key="user.id"
            class="flex justify-between items-center px-3 py-2 rounded-lg bg-gray-700"
          >
            <div class="flex items-center gap-2">
              <UIcon
                :name="getMedalIcon(idx)"
                :class="getMedalColor(idx)"
                class="w-5 h-5"
              />
              <img
                v-if="user.avatarUrl"
                :src="user.avatarUrl"
                alt="Аватар"
                class="w-8 h-8 rounded-full object-cover"
                loading="lazy"
                @error="(e) => e.target.src='default-avatar.png'"
              />
              <UIcon v-else name="i-heroicons-user" class="w-6 h-6 text-gray-400"/>
              <span>{{ user.login }}</span>
            </div>
            <span class="font-bold text-indigo-400">{{ user[activeTab] }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Поиск + обновление -->
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="Поиск пользователя..."
        class="w-full md:w-1/3 bg-gray-800 border-gray-600 rounded-xl text-white placeholder-gray-400"
      />
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

    <!-- Таблица пользователей -->
    <div class="max-w-6xl mx-auto bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-md overflow-x-auto">
      <table class="w-full min-w-[600px] border-collapse text-gray-100">
        <thead>
          <tr class="bg-gray-700 text-gray-200">
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3 text-center cursor-pointer select-none"
              :class="col.key === 'login' ? 'text-left' : ''"
              @click="sortBy(col.key)"
            >
              <div class="flex items-center justify-center gap-1">
                <span>{{ col.label }}</span>
                <span v-if="sortKey === col.key">
                  <UIcon
                    v-if="sortAsc"
                    name="i-heroicons-chevron-up"
                    class="w-4 h-4 transition-transform duration-200 my-auto"
                  />
                  <UIcon
                    v-else
                    name="i-heroicons-chevron-down"
                    class="w-4 h-4 transition-transform duration-200"
                  />
                </span>
                <span v-else>
                  <UIcon
                    name="i-heroicons-chevron-up-down"
                    class="w-4 h-4 opacity-30"
                  />
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-700 transition-colors">
            <td class="px-4 py-3 text-left flex items-center gap-2">
              <img
                v-if="user.avatarUrl"
                :src="user.avatarUrl"
                alt="Аватар"
                class="w-8 h-8 rounded-full object-cover"
                loading="lazy"
                @error="(e) => e.target.src='default-avatar.png'"
              />
              <UIcon v-else name="i-heroicons-user" class="w-6 h-6 text-gray-400"/>
              <span>{{ user.login }}</span>
            </td>
            <td class="px-4 py-3 text-center font-semibold text-blue-400">{{ user.today }}</td>
            <td class="px-4 py-3 text-center font-semibold text-green-400">{{ user.week }}</td>
            <td class="px-4 py-3 text-center font-semibold text-purple-400">{{ user.month }}</td>
            <td class="px-4 py-3 text-center font-bold text-indigo-400">{{ user.total }}</td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" class="text-center py-6 text-gray-500">
              Нет данных
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useToast } from '#imports'
import gsap from 'gsap'

definePageMeta({ layout: 'user' })

const toast = useToast()
const isLoading = ref(false)
const activeTab = ref<'today' | 'week' | 'month'>('month')
const searchQuery = ref("")

const tabs = [
  { label: 'Сегодня', value: 'today', icon: 'i-heroicons-sun' },
  { label: 'Неделя', value: 'week', icon: 'i-heroicons-calendar' },
  { label: 'Месяц', value: 'month', icon: 'i-heroicons-clock' },
]

type UserStats = {
  id: number
  login: string
  avatarUrl: string
  today: number
  week: number
  month: number
  total: number
}

const usersStats = ref<UserStats[]>([])

const totals = ref({ today: 0, week: 0, month: 0 })
const userCount = ref(0)

// 🔢 Анимированные значения
const animatedTotals = ref({ today: 0, week: 0, month: 0 })
const animatedUserCount = ref(0)

// функция анимации
const animateValue = (target: any, key: string, newVal: number) => {
  gsap.to(target, {
    [key]: newVal,
    duration: 1.2,
    ease: "power1.out",
    roundProps: key
  })
}

const fetchStats = async () => {
  try {
    isLoading.value = true
    const res = await $fetch("/api/codes/stats/all")
    if (res.error) throw new Error(res.error)

    usersStats.value = (res.users || []).map((u: any) => ({
      id: u.id,
      login: u.login,
      avatarUrl: u.avatarUrl || "",
      today: Number(u.today),
      week: Number(u.week),
      month: Number(u.month),
      total: Number(u.total)
    }))

    const newTotals = {
      today: usersStats.value.reduce((acc, u) => acc + u.today, 0),
      week: usersStats.value.reduce((acc, u) => acc + u.week, 0),
      month: usersStats.value.reduce((acc, u) => acc + u.month, 0)
    }

    const newUserCount = usersStats.value.length

    // запускаем анимацию
    animateValue(animatedTotals.value, "today", newTotals.today)
    animateValue(animatedTotals.value, "week", newTotals.week)
    animateValue(animatedTotals.value, "month", newTotals.month)
    animateValue(animatedUserCount, "value", newUserCount)

    totals.value = newTotals
    userCount.value = newUserCount
  } catch (err: any) {
    toast.add({ title: err.message || "Ошибка загрузки статистики", color: "error" })
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchStats)

const columns = [
  { key: 'login', label: 'Пользователь' },
  { key: 'today', label: 'Сегодня' },
  { key: 'week', label: 'Неделя' },
  { key: 'month', label: 'Месяц' },
  { key: 'total', label: 'Всего' },
]

const sortKey = ref<'login' | 'today' | 'week' | 'month' | 'total'>('total')
const sortAsc = ref(false)

const sortBy = (key: typeof sortKey.value) => {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else { sortKey.value = key; sortAsc.value = true }
}

const sortedUsers = computed(() => {
  return [...usersStats.value].sort((a, b) => {
    if (sortKey.value === 'login') {
      const res = a.login.localeCompare(b.login)
      return sortAsc.value ? res : -res
    } else {
      const res = a[sortKey.value] - b[sortKey.value]
      return sortAsc.value ? res : -res
    }
  })
})

const filteredUsers = computed(() => {
  if (!searchQuery.value) return sortedUsers.value
  return sortedUsers.value.filter(u =>
    u.login.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const tabLabel = computed(() => {
  if (activeTab.value === 'today') return 'день'
  if (activeTab.value === 'week') return 'неделя'
  return 'месяц'
})

const topGroups = computed(() => {
  const key = activeTab.value
  const sorted = [...usersStats.value].sort((a, b) => b[key] - a[key])
  return [0, 1, 2].map(i => sorted.slice(i * 3, i * 3 + 3))
})

const getMedalIcon = (idx: number) => {
  if (idx === 0) return 'i-heroicons-trophy'
  if (idx === 1) return 'i-heroicons-star'
  if (idx === 2) return 'i-heroicons-fire'
  return 'i-heroicons-user'
}

const getMedalColor = (idx: number) => {
  if (idx === 0) return 'text-yellow-400'
  if (idx === 1) return 'text-gray-300'
  if (idx === 2) return 'text-orange-400'
  return 'text-gray-400'
}
</script>

<style scoped>
tbody tr:hover {
  background-color: #374151;
  transition: background-color 0.2s;
}
</style>
