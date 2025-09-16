<template>
    <div class="min-h-screen text-neutral-200 flex flex-col gap-4 relative">
        <Header @click="BackHome" />
        <ExitAccount/>
        <div class="flex flex-row justify-end p-4 gap-4">
            <va-button class=" shadow-lg px-6 py-3 rounded-full" color="primary" @click="goToStats">
                <Icon name="streamline-plump:content-statistic-remix" class="w-5 h-5 mr-2" />
            Общая статистика
            </va-button>
            <!--  -->
            <va-button class=" shadow-lg px-6 py-3 rounded-full" color="primary" @click="goToStatsAll">
                <Icon name="streamline-plump:content-statistic" class="w-5 h-5 mr-2" />
                Моя статистика
            </va-button>
        </div>

        <div class="p-4">
            <slot />
        </div>

        <!-- Овальная кнопка статистики -->

    </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router"

const router = useRouter()

const goToStats = () => {
    router.push("/stats") // путь на страницу статистики
}
const goToStatsAll = () => {
    router.push("/stats/all") // путь на страницу статистики
}
const BackHome = () => {
    router.push("/home") // путь на страницу статистики
}
</script>

<style lang="scss" scoped></style>
