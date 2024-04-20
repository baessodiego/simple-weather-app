<template>
    <div>

        <TransitionRoot :show="sidebarOpen" as="template">
            <Dialog as="div" class="relative z-50 lg:hidden" @close="sidebarOpen = false">
                <TransitionChild as="template" enter="transition-opacity ease-linear duration-300"
                                 enter-from="opacity-0" enter-to="opacity-100"
                                 leave="transition-opacity ease-linear duration-300" leave-from="opacity-100"
                                 leave-to="opacity-0">
                    <div class="fixed inset-0 bg-gray-900/80"/>
                </TransitionChild>

                <div class="fixed inset-0 flex">
                    <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
                                     enter-from="-translate-x-full" enter-to="translate-x-0"
                                     leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
                                     leave-to="-translate-x-full">
                        <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
                            <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                                             enter-to="opacity-100" leave="ease-in-out duration-300"
                                             leave-from="opacity-100" leave-to="opacity-0">
                                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                                    <button class="-m-2.5 p-2.5" type="button" @click="sidebarOpen = false">
                                        <span class="sr-only">Close sidebar</span>
                                        <i aria-hidden="true" class="fas fa-xmark"></i>
                                    </button>
                                </div>
                            </TransitionChild>
                            <div
                                class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2 ring-1 ring-white/10">
                                <div class="flex h-16 shrink-0 items-center">
                                    <h1 class="font-black"><i class="fas fa-sun mr-2"></i>A Simple Weather App</h1>
                                </div>
                                <nav class="flex flex-1 flex-col">
                                    <ul class="flex flex-1 flex-col gap-y-7" role="list">
                                        <li>
                                            <ul class="-mx-6" role="list">
                                                <li v-for="item in navigation" :key="item.name">
                                                    <NuxtLink :to="item.href"
                                                              class="text-gray-600 hover:bg-neutral-200  flex items-center group gap-x-3 py-6 px-4 text-sm leading-6 font-semibold transition-all">
                                                        <i :class="item.icon" aria-hidden="true"
                                                           class="text-center min-w-8 fa-sharp text-xl"/>
                                                        {{ item.name }}
                                                    </NuxtLink>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </TransitionRoot>
        <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-neutral-100 border-r px-6">
                <div class="flex h-16 shrink-0 items-center">
                    <h1 class="font-black"><i class="fas fa-sun mr-2"></i>A Simple Weather App</h1>
                </div>
                <form class="search-form relative" @submit.prevent="getCityWeather">
                    <input v-model="city" class="p-2 rounded-lg w-full" placeholder="Cerca città" type="text"/>
                    <button class="absolute right-4 text-gray-500 top-2" type="submit">
                        <i aria-hidden="true" class="fas fa-search"></i>
                    </button>
                </form>
                <nav class="flex flex-1 flex-col">
                    <ul class="flex flex-1 flex-col gap-y-7" role="list">
                        <li>
                            <ul class="-mx-6" role="list">
                                <li v-for="item in navigation" :key="item.name">
                                    <NuxtLink :to="item.href"
                                              class="text-gray-600 hover:bg-neutral-200  flex items-center group gap-x-3 py-6 px-4 text-sm leading-6 font-semibold transition-all">
                                        <i :class="item.icon" aria-hidden="true"
                                           class="text-center min-w-8 fa-sharp text-xl"/>
                                        {{ item.name }}
                                    </NuxtLink>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>



        <div class="sticky top-0 z-40 flex items-center gap-x-6 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
            <button class="-m-2.5 p-2.5 text-gray-400 lg:hidden" type="button" @click="sidebarOpen = true">
                <span class="sr-only">Open sidebar</span>
                <i aria-hidden="true" class="fas fa-bars"></i>
            </button>
            <div class="flex-1 text-sm font-semibold leading-6">A Simple Weather App</div>
            <form class="relative" @submit="getCityWeather">
                <input v-model="city" class="p-2 rounded-lg w-full" placeholder="Cerca città" type="text"/>
                <button class="absolute right-4 text-gray-500 top-2" type="submit">
                    <i aria-hidden="true" class="fas fa-search"></i>
                </button>
            </form>
        </div>

        <main class="lg:pl-72 py-12">
            <div class="px-4 sm:px-6 lg:px-8">
                <slot/>
            </div>
        </main>
    </div>
</template>

<script setup>
import 'assets/fontawesome/css/all.css'
import 'assets/fontawesome/css/sharp-solid.css'
import { useSiteStore } from '@/store/siteStore.js'
import { ref } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

const route = useRoute()
const store = useSiteStore()
// get first value for city from siteStore
const city = ref(store.city.name ?? 'Torino')
const getCityWeather = async (e) => {
    e.preventDefault()
    if (city.value) {
        store.loading = true

        const getCoord = await store.getCityCoordinates(city.value)
        if (getCoord) {
            await store.getTodayWeather()
            await store.getForecastWeather()
            await store.getAirQuality()
        }
       setTimeout(() => {
            store.loading = false
        }, 1000)
    }
}

useHead({
    bodyAttrs: {
        class: 'bg-neutral-50'
    }
})


const navigation = [
    {name: 'Oggi', href: '/', icon: 'fa-home', current: true},
    {name: 'Previsioni', href: '/previsioni', icon: 'fa-cloud-sun', current: false},
    {name: 'Info', href: '/info', icon: 'fa-book', current: false},
]

const sidebarOpen = ref(false)


</script>


<style>
.router-link-active {
    @apply bg-neutral-200
}
</style>