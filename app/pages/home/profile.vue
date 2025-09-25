<template>
  <div class="min-h-screen  flex items-center justify-center p-6">
    <div class="w-full max-w-2xl bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
      <h1 class="text-2xl font-bold text-white mb-6 text-center">Мой профиль</h1>

      <!-- Аватарка -->
      <section class="mb-8">
        <h2 class="text-lg font-semibold text-gray-200 mb-3">Аватар</h2>
        <div class="flex items-center gap-4">
          <img v-if="avatarUrl" :src="avatarUrl" alt="Аватар" class="w-16 h-16 rounded-full border border-gray-600 object-cover" />
          <div v-else class="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">Нет фото</div>
          <UInput v-model="newAvatarUrl" placeholder="Вставьте ссылку на аватарку" class="flex-1 bg-gray-700 border-gray-600 rounded-xl text-white placeholder-gray-400" />
          <UButton color="primary" @click="updateAvatar">Сохранить</UButton>
        </div>
      </section>

      <!-- Смена логина -->
      <section class="mb-8">
        <h2 class="text-lg font-semibold text-gray-200 mb-3">Смена логина</h2>
        <div class="flex gap-2">
          <UInput v-model="newLogin" placeholder="Новый логин" class="flex-1 bg-gray-700 border-gray-600 rounded-xl text-white placeholder-gray-400" />
          <UButton color="primary" @click="updateLogin">Сохранить</UButton>
        </div>
      </section>

      <!-- Смена пароля -->
      <section>
        <h2 class="text-lg font-semibold text-gray-200 mb-3">Смена пароля</h2>
        <div class="flex flex-col gap-3">
          <UInput v-model="oldPassword" type="password" placeholder="Старый пароль" class="bg-gray-700 border-gray-600 rounded-xl text-white placeholder-gray-400" />
          <UInput v-model="newPassword" type="password" placeholder="Новый пароль" class="bg-gray-700 border-gray-600 rounded-xl text-white placeholder-gray-400" />
          <UButton color="primary" @click="updatePassword">Сохранить</UButton>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useToast } from "#imports"

definePageMeta({ layout: "user" })
const toast = useToast()

const avatarUrl = ref("")
const newAvatarUrl = ref("")
const newLogin = ref("")
const oldPassword = ref("")
const newPassword = ref("")

onMounted(async () => {
  try {
    const res = await $fetch("/api/me")
    avatarUrl.value = res.user?.avatarUrl || ""
    newLogin.value = res.user?.login || ""
  } catch {
    toast.add({ title: "Ошибка загрузки профиля", color: "error" })
  }
})

const updateAvatar = async () => {
  if (!newAvatarUrl.value) return
  try {
    const res = await $fetch("/api/profile/avatar", { method: "POST", body: { avatarUrl: newAvatarUrl.value }, headers: { "Content-Type": "application/json" } })
    avatarUrl.value = newAvatarUrl.value
    newAvatarUrl.value = ""
    toast.add({ title: res.message || "Аватар обновлен", color: "primary" })
  } catch (err: any) {
    toast.add({ title: err.message || "Ошибка", color: "error" })
  }
}

const updateLogin = async () => {
  if (!newLogin.value) return
  try {
    const res = await $fetch("/api/profile/login", { method: "POST", body: { login: newLogin.value }, headers: { "Content-Type": "application/json" } })
    toast.add({ title: res.message || "Логин обновлен", color: "primary" })
  } catch (err: any) {
    toast.add({ title: err.message || "Ошибка", color: "error" })
  }
}

const updatePassword = async () => {
  if (!oldPassword.value || !newPassword.value) return
  try {
    const res = await $fetch("/api/profile/password", { method: "POST", body: { oldPassword: oldPassword.value, newPassword: newPassword.value }, headers: { "Content-Type": "application/json" } })
    oldPassword.value = ""
    newPassword.value = ""
    toast.add({ title: res.message || "Пароль обновлен", color: "primary" })
  } catch (err: any) {
    toast.add({ title: err.message || "Ошибка", color: "error" })
  }
}
</script>
