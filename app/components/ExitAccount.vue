<template>
  <UButton
    variant="soft"
    color="gray"
    size="lg"
    style="border: 1px solid transparent;"
    class="rounded-full exit-btn px-5 max-w-max"
    @click="logout"
  >
    <UIcon name="i-heroicons-arrow-left-on-rectangle" class="mr-2 w-5 h-5" />
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
      color: "success",
    })

    window.location.reload()
  } catch (err: any) {
    toast.add({
      title: err.message || "Ошибка при выходе",
      color: "error",
    })
  }
}
</script>

<style scoped>
.exit-btn:hover {
  background-color: rgba(239, 68, 68, 0.15) !important; /* лёгкий красный фон */
  color: #f87171 !important; /* text-red-400 */
  border: 1px solid rgba(239, 68, 68, 0.4)!important;
  transition: all 0.2s ease;
}
</style>
