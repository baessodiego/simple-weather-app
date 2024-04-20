<template>
    <div>
        <NuxtLayout>
            <NuxtPage/>
        </NuxtLayout>
    </div>
</template>


<script setup>
import { useSiteStore } from "~/store/siteStore.js";
const store = useSiteStore()

await store.getCityCoordinates()
await store.getTodayWeather()
await store.getForecastWeather()


</script>
<style>
.page-enter-active,
.page-leave-active {
    transition: all .2s;
}

.page-enter-from,
.page-leave-to {
    opacity: 0;
    filter: blur(1rem);
}
</style>