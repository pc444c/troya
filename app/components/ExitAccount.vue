<template>
  <va-button color="danger" @click="logout">
    <Icon name="mdi:logout" class="mr-2" />
    Выйти
  </va-button>
</template>

<script setup lang="ts">
import { useToast } from "vuestic-ui"

const { notify } = useToast()

const logout = async () => {
  try {
    const res = await $fetch("/api/logout", { method: "POST" })

    if (process.client) {
      notify({
        message: res.message,
        color: "success",
        duration: 2000,
      })
    }

    // редиректим после выхода
  window.location.reload()
  } catch (err: any) {
    if (process.client) {
      notify({
        message: err.message || "Ошибка при выходе",
        color: "danger",
      })
    }
  }
}
</script>
