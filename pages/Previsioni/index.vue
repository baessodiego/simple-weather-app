<template>
    <div v-if="forecastData">
        <div class="container bg-neutral-100 rounded-xl p-12 text-center relative overflow-hidden h-32">
            <h3 :style="forecastData.city.name.length > 8 ? 'font-size: 200px' : 'font-size: 300px'"
                class="absolute opacity-30 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 font-bold uppercase italic text-neutral-200 whitespace-nowrap">
                {{ store.city.name }}</h3>
        </div>

        <div class="my-24">
            <div class="container mb-4">
                <h1 class="text-neutral-600 text-xl">
                    Previsioni per i prossimi giorni
                </h1>
            </div>

            <div v-if="store.loading" class="animate-pulse bg-neutral-100 p-12 rounded-xl h-[450px] container">

            </div>
            <div v-else class="bg-neutral-100 p-12 rounded-xl container">
                <client-only>
                    <VueApexCharts :options="forecastOptions" :series="forecastSeries" height="450"></VueApexCharts>
                </client-only>
            </div>
        </div>
    </div>
    <div v-else>
        Nulla da vedere
    </div>
</template>

<script setup lang="ts">
import VueApexCharts from "vue3-apexcharts";
import { useSiteStore } from "@/store/siteStore.js";
import { storeToRefs } from 'pinia'

const store = useSiteStore()
const {forecastWeather} = storeToRefs(store)
const forecastData = computed(() => forecastWeather.value)

useHead(() => {
    return {
        title: 'Previsioni',
        meta: [
            {
                name: 'description',
                content: 'Previsioni meteo per i prossimi giorni'
            }
        ]
    }

})




const forecastSeries = ref([
    {
        name: "Temperatura",
        data: forecastData.value.list.map(temp => Math.round(temp.main.temp)),
    },
    {
        name: "Percepita",
        data: forecastData.value.list.map(temp => Math.round(temp.main.feels_like))
    },
])
const forecastOptions = {
    chart: {
        type: 'area',
        zoom: {
            enabled: true
        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left',
        fontSize: '12px',
        fontWeight: 400,
        offsetY: 0,
    },
    /*dataLabels: {
        enabled: true,
        enabledOnSeries: [0],
        offsetY: '-100%',
        style: {
            fontSize: '12px',
            fontWeight: 400
        },
        background: {
            enabled: true,
            foreColor: '#fff',
            padding: 5,
            borderWidth: 0,
            borderRadius: 3,
            opacity: 0.6,
        },
        formatter: function (value, {seriesIndex, dataPointIndex, w}) {
            if (dataPointIndex % 8 === 0 && dataPointIndex !== 0) {
                const weatherDescription = forecastData.value.list[dataPointIndex].weather[0].description
                return weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1)
            } else {
                return ''
            }
        },
    },*/
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
        categories: forecastData.value.list.map(temp => temp.dt_txt),
        datetimeUTC: false
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
    console.log(forecastData)
    forecastSeries.value[0].data = forecastData.value.list.map(temp => Math.round(temp.main.temp))
    forecastSeries.value[1].data = forecastData.value.list.map(temp => Math.round(temp.main.feels_like))
}
</script>

<style scoped>

</style>