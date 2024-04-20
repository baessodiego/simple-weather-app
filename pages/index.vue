<template>
    <div class="relative">
        <div v-if="todayData && forecastData">

            <!--            loading state-->


            <div v-if="store.loading" class="h-36 py-1 animate-pulse container bg-neutral-100 rounded-xl p-12  gap-4 flex items-center justify-center relative">
                <div class="h-4 bg-neutral-200 w-48 rounded-full">
                </div>
                <div class="h-4 bg-neutral-200 w-14 rounded-full">
                </div>
            </div>
            <div v-else class="container bg-neutral-100 rounded-xl p-12 text-center relative overflow-hidden">
                <h3 :class="todayData.name.length > 8 ? 'md:text-[200px]' : 'md:text-[300px]'"
                    class="absolute opacity-30 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 font-bold uppercase italic text-neutral-200 whitespace-nowrap">
                    {{ store.city.name }}</h3>
                <h2 class="text-5xl capitalize font-bold text-neutral-600 relative">
                    {{ todayData.weather[0].description }}
                    <i :class="getIcon(todayData.weather[0].id)" class="fad  ml-1"></i>
                </h2>
            </div>

            <div class="my-24">
                <div class="container mb-8 flex items-center">
                    <h1 class="text-neutral-600 text-xl ">
                        Temperatura di oggi
                        <span v-if="!store.loading" class="ml-2 font-bold text-2xl"><i
                        class="fas fa-location-pin"></i> {{ store.city.name }}
                        </span>
                        <span v-else class="ml-2 inline-block h-4 rounded-full bg-neutral-400 w-24 animate-pulse"></span>

                    </h1>
                </div>
                <div class="container grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-6 mb-6">
                    <div class="col-span-1 bg-neutral-100 py-12 p-6 2xl:p-12 rounded-xl ">
                        <div class="flex items-center gap-3">
                            <i class="text-5xl fad fa-temperature-snow text-blue-500"></i>
                            <div>
                                <span v-if="store.loading" class="inline-block h-12 w-12 rounded-full bg-neutral-400  animate-pulse"></span>
                                <span v-else class="font-bold text-5xl text-gray-700 ">{{ Math.round(minTemp) }}</span>
                                <span class="text-2xl font-bold ml-1">°C</span>
                            </div>
                            <p v-if="store.loading" class="ml-auto h-4 bg-neutral-200 w-24 rounded-full"></p>
                            <p v-else class="animate-pulse ml-auto font-bold text-4xl xl:text-xl 2xl:text-3xl text-gray-400">Minima</p>
                        </div>
                    </div>
                    <div class="col-span-1 bg-neutral-100 py-12 p-6 2xl:p-12 rounded-xl ">
                        <div class="flex items-center gap-3">
                            <i class="text-5xl fad fa-temperature-sun text-yellow-500"></i>
                            <div>
                                 <span v-if="store.loading" class="inline-block h-12 w-12 rounded-full bg-neutral-400  animate-pulse"></span>
                                <span v-else class="font-bold text-5xl text-gray-700">{{ Math.round(maxTemp) }}</span>
                                <span class="text-2xl font-bold ml-1">°C</span>
                            </div>
                            <p v-if="store.loading" class="ml-auto h-4 bg-neutral-200 w-24 rounded-full"></p>
                            <p v-else class="animate-pulse ml-auto font-bold text-4xl xl:text-xl 2xl:text-3xl text-gray-400">Massima</p>
                        </div>
                    </div>
                    <div class="col-span-1 bg-neutral-100 py-12 p-6 2xl:p-12 rounded-xl ">
                        <div class="flex items-center gap-3">
                            <i class="text-5xl fad fa-droplet-percent text-slate-500"></i>
                            <div>
                                 <span v-if="store.loading" class="inline-block h-12 w-12 rounded-full bg-neutral-400  animate-pulse"></span>
                                <span v-else class="font-bold text-5xl text-gray-700">{{ todayData.main.humidity }}</span>
                                <span class="text-2xl font-bold ml-1">%</span>
                            </div>
                            <p v-if="store.loading" class="ml-auto h-4 bg-neutral-200 w-24 rounded-full"></p>
                            <p v-else class="animate-pulse ml-auto font-bold text-4xl xl:text-xl 2xl:text-3xl text-gray-400">Umidità</p>
                        </div>
                    </div>


                </div>

                <div v-if="store.loading" class="animate-pulse bg-neutral-100 p-12 rounded-xl h-[450px] container">

                </div>
                <div v-else class="bg-neutral-100 p-12 rounded-xl container">
                    <client-only>
                        <VueApexCharts :options="todayOptions" :series="todaySeries" height="450"></VueApexCharts>
                    </client-only>
                </div>

            </div>
        </div>

        <div v-else>
            Nulla da vedere
        </div>
    </div>
</template>

<script setup>
import VueApexCharts from "vue3-apexcharts";
import { useSiteStore } from "@/store/siteStore.js";
import { storeToRefs } from 'pinia'

useHead(() => {
    return {
        title: 'Che tempo fa oggi',
        meta: [
            {
                name: 'description',
                content: 'Previsioni meteo di oggi'
            }
        ]
    }
})

const store = useSiteStore()
const {todayWeather, forecastWeather, airQuality} = storeToRefs(store)

const todayData = computed(() => todayWeather.value)
const forecastData = computed(() => forecastWeather.value)
//const airQualityData = computed(() => airQuality.value)

const minTemp = computed(() => Math.min(...forecastData.value.list.map(data => data.main.temp_min)))
const maxTemp = computed(() => Math.max(...forecastData.value.list.map(data => data.main.temp_max)))

const getIcon = (weatherCode) => {
    if (weatherCode >= 200 && weatherCode < 300) {
        return 'fa-bolt'
    } else if (weatherCode >= 300 && weatherCode < 400) {
        return 'fa-cloud-drizzle text-blue-400'
    } else if (weatherCode >= 500 && weatherCode < 600) {
        return 'fa-cloud-rain text-blue-400'
    } else if (weatherCode >= 600 && weatherCode < 700) {
        return 'fa-snowflake'
    } else if (weatherCode >= 700 && weatherCode < 800) {
        return 'fa-smog'
    } else if (weatherCode === 800) {
        return 'fa-sun text-yellow-400'
    } else {
        return 'fa-cloud'
    }
}

const today = new Date().toISOString().split('T')[0]
const todayHoursCategories = []
forecastData.value.list.map(data => new Date(data.dt * 1000).toISOString().split('T')[0] === today ? todayHoursCategories.push(data.dt_txt) : null)

const todaySeries = ref([
    {
        name: "Temperatura",
        data: forecastData.value.list.map(data => new Date(data.dt * 1000).toISOString().split('T')[0] === today ? Math.round(data.main.temp) : null),
    },
    {
        name: "Percepita",
        data: forecastData.value.list.map(data => new Date(data.dt * 1000).toISOString().split('T')[0] === today ? Math.round(data.main.feels_like) : null),
    },
])


const todayOptions = {
    chart: {
        type: 'area',
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left',
        fontSize: '16px',
        fontWeight: 400,
        offsetY: 0,
    },
    stroke: {
        curve: 'smooth'
    },
    grid: {
        row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.2
        },
    },
    yaxis: {
        title: {
            style: {
                color: '#666',
                fontSize: '12px',
                fontWeight: 200,
            },
            offsetX: 0,
        },
    },
    xaxis: {
        type: 'datetime',
        labels: {
            format: 'HH:mm',
            datetimeUTC: false
        },
        categories: todayHoursCategories,
    },
    tooltip: {
        x: {
            format: 'dd MMMM HH:mm'
        },
    },
    colors: ['#6366f1', '#d946ef']
}

watch(forecastWeather, () => {
    updateChart()
}, {deep: true})

const updateChart = () => {
    todaySeries.value[0].data = forecastData.value.list.map(data => new Date(data.dt * 1000).toISOString().split('T')[0] === today ? Math.round(data.main.temp) : null)
    todaySeries.value[1].data = forecastData.value.list.map(data => new Date(data.dt * 1000).toISOString().split('T')[0] === today ? Math.round(data.main.feels_like) : null)
}
</script>

<style scoped>

</style>