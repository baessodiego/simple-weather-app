<template>
    <div v-if="forecastData">
        <div class="container bg-neutral-100 rounded-xl p-12 text-center relative overflow-hidden h-32">
            <h3 :class="forecastData.city.name.length > 8 ? 'text-4xl md:text-[200px]' : 'text-4xl md:text-[300px]'"
                class="absolute opacity-30 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 font-bold uppercase italic text-neutral-500 md:text-neutral-200 whitespace-nowrap">
                {{ store.city.name }}</h3>
        </div>

        <div class="mt-24 mb-12">
            <div class="container mb-4">
                <h1 class="text-neutral-600 text-xl">
                    Previsioni per i prossimi giorni
                </h1>
            </div>


            <div class="container mb-12">
                <div class="flex lg:inline-flex flex-col mt-4 rounded-xl overflow-hidden">
                    <div v-for="(day, idx) in weekWeather" :key="day.id"
                         :class="idx === weekWeather.length-1 ? '':'border-b'"
                         class="flex items-center justify-between bg-neutral-100 gap-24 px-6 md:px-16 py-4">
                        <h3 class=" text-neutral-600 text-lg capitalize">{{ day.date }}</h3>
                        <div class=" flex items-center gap-2">
                            <i :class="getIcon(day.id)" class="fad text-2xl mr-1"></i>
                            <p class="capitalize text-neutral-600">{{ day.weather }}</p>

                        </div>
                        <p class="">
                            <i class="fad fa-temperature text-2xl text-neutral-600 mr-1"></i>
                            <span class="text-neutral-400 font-bold ">{{ day.temp }}°</span>
                        </p>
                    </div>
                </div>
            </div>


            <div v-if="store.loading" class="animate-pulse bg-neutral-100 p-12 rounded-xl h-[450px] container">
            </div>
            <div v-else class="bg-neutral-100 px-4 md:px-12 py-12 rounded-xl container">
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

<script setup>
import VueApexCharts from "vue3-apexcharts";
import { useSiteStore } from "@/store/siteStore.js";
import { storeToRefs } from 'pinia'

const store = useSiteStore()
const {forecastWeather} = storeToRefs(store)

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

const forecastData = computed(() => forecastWeather.value)
const weekWeather = ref([])

const pushDayWeather = (el) => {
    weekWeather.value.push({
        id: el.weather[0].id,
        date: new Date(el.dt_txt).toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'long'
        }),
        weather: el.weather[0].description,
        temp: Math.round(el.main.temp),
    })
}
forecastData.value.list.forEach((el, index) => {
    if (index === 0 && el.dt_txt > '12:00:00') {
        pushDayWeather(el)
    } else if (el.dt_txt.includes('12:00:00')) {
        pushDayWeather(el)
    }
})


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