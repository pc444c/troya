<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center p-6">
    <div class="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6">
      <!-- Заголовок -->
      <h1 class="text-2xl font-bold text-white mb-4 text-center">
        Телефонные коды
      </h1>
      <p class="text-gray-400 text-center mb-6">
        Поиск оператора или города по номеру телефона
      </p>

      <!-- Сам виджет в светлой карточке -->
      <div class="bg-white rounded-lg p-4">
        <div id="kody_widget">
          <a href="https://www.kody.su/" target="_blank">
            <img
              alt="kody.su: телефонные коды"
              src="https://www.kody.su/img/mlogo.png"
              class="mx-auto"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
definePageMeta({ layout: "user" });
onMounted(() => {
  // Конфиг для виджета
  window.kody_options = {
    id: "kody_widget",
    caption: "Оператор/город по номеру телефона",
  }

  // Подключаем скрипт
  const s = document.createElement("script")
  s.type = "text/javascript"
  s.charset = "UTF-8"
  s.async = true
  s.src = "https://www.kody.su/embed/widget.min.js"
  document.head.appendChild(s)
})
</script>

<style scoped>
/* Чуть адаптируем для тёмной темы */
.bg-white {
  color: black;
}
</style>
