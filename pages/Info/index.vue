<template>
    <div class="container">

        <div class="container ">
            <h1 class="text-neutral-600 text-xl">Info sull'applicazione</h1>
            <div class="bg-neutral-100 mt-6 p-8 rounded-xl">
                <p> Librerie usate per il progetto:</p>

                <ul class="mt-2">
                    <li v-for="lib in libreries" class="flex items-center justify-start">
                        <div class="basis-10 flex justify-center">
                            <img :src="lib.img" alt="lib.name" class="h-8 w-auto">
                        </div>
                        <span>{{ lib.name }}</span>
                    </li>
                </ul>
            </div>

            <div class="bg-neutral-100 mt-6 p-8 rounded-xl">
                <p>API utilizzata: <a class="font-bold hover:italic"
                                      href="https://openweathermap.org/api">OpenWeather</a></p>
                <ul class="list-disc list-inside">
                    <li>Current Weather Data</li>
                    <li>5 Day / 3 Hour Forecast</li>
                </ul>
            </div>

            <div class="bg-neutral-100 mt-6 p-8 rounded-xl">
                <p>Logica</p>
                <ul>
                    <li>
                        <code>getCityCoordinates(city [default=torino])</code> - Ottiene le coordinate della città (latitudine e longitudine)
                    </li>
                    <li>
                        <code>getCityWeather()</code> - Ottiene le informazioni meteo della città
                    </li>
                    <li>
                        <code>getCityForecast()</code> - Ottiene le previsioni meteo della città
                    </li>
                </ul>
                <p>Vengono chiamate tutte al primo avvio in <code>App.vue</code>, successivamente verranno chiamate al <i>submit</i> del form di ricerca</p>
                <p class="mt-2">I test possono essere creati utilizzando Cypress, si trovano nella cartella <code>cypress/e2e/base-test</code></p>
                <p>Per aprire l'app di Cypress utilizzare il comando <code>npx cypress open</code></p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

useHead(() => {
    return {
        title: 'Info',
        meta: [
            {
                name: 'description',
                content: 'Informazioni sull\'applicazione'
            }
        ]
    }

})

const libreries = [
    {
        name: 'Vue3',
        img: 'https://cdn.iconscout.com/icon/free/png-256/vue-282497.png',
    },
    {
        name: 'Nuxt',
        img: 'https://nuxt.com/assets/design-kit/icon-green.svg',
    },
    {
        name: 'Pinia',
        img: 'https://pinia.esm.dev/logo.svg',
    },
    {
        name: 'Apex Charts',
        img: 'https://apexcharts.com/media/apexcharts-logo.png',
    },
    {
        name: 'Tailwind CSS',
        img: 'https://cdn.iconscout.com/icon/free/png-256/tailwindcss-3522414-2944871.png',
    },
    {
        name: 'SweetAlert2',
        img: '/img/swal2.png' +
            '',
    }
]
</script>

<style scoped>

</style>