<template>
  <UButton color="red" variant="solid" @click="logout">
    <UIcon name="i-heroicons-arrow-left-on-rectangle" class="mr-2" />
    Выйти
  </UButton>
</template>

<script setup lang="ts">
import { useToast } from '#imports'

const toast = useToast()

const logout = async () => {
  try {
    const res = await $fetch("/api/logout", { method: "POST" })

    toast.add({
      title: res.message,
      color: "green",
      timeout: 2000,
    })

    // после выхода обновляем страницу
    window.location.reload()
  } catch (err: any) {
    toast.add({
      title: err.message || "Ошибка при выходе",
      color: "red",
    })
  }
}
</script>
