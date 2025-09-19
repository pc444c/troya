
<template>
  <UApp>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout></UApp>
</template>

<script lang="ts" setup>
definePageMeta({
  colorMode: 'dark',
})
onMounted(() => {
  document.documentElement.classList.add('dark')
})

</script>
