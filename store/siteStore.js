import { defineStore } from 'pinia'
import Swal from 'sweetalert2'

export const useSiteStore = defineStore('site', {
    state: () => ({
        city: {
            name: 'Torino',
            lat: null,
            lon: null,
        },
        todayWeather: null,
        forecastWeather: null,
        airQuality: null,
        loading: false,
    }),
    actions: {
        async getCityCoordinates(cityName = 'Torino') {
            const config = useRuntimeConfig().public
            const url = 'http://api.openweathermap.org/geo/1.0/'
            const apikey = config['WEATHER_API_KEY']
            try {
                const response = await $fetch(url + 'direct?q=' + cityName + '&limit=1&appid=' + apikey, {
                    method: 'GET'
                })
                this.city.lat = response[0].lat
                this.city.lon = response[0].lon
                this.city.name = response[0].local_names && response[0].local_names['it'] ? response[0].local_names['it'] : response[0].name
                return true
            } catch (error) {
                await Swal.fire({
                    toast: true,
                    text: 'La città inserita non esiste o non è stata trovata.',
                    position: 'top-end',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 3000,
                })
            }
        },
        async getTodayWeather() {
            const config = useRuntimeConfig().public
            const url = config['WEATHER_URL']
            const apikey = config['WEATHER_API_KEY']
            try {
                this.todayWeather = await $fetch(url + '/weather?lat=' + this.city.lat + '&lon=' + this.city.lon + '&lang=it&units=metric&appid=' + apikey, {
                    method: 'GET'
                })
            } catch (error) {
            }
        },
        async getForecastWeather() {
            const config = useRuntimeConfig().public
            const url = config['WEATHER_URL']
            const apikey = config['WEATHER_API_KEY']
            try {
                this.forecastWeather = await $fetch(url + '/forecast?lat=' + this.city.lat + '&lon=' + this.city.lon + '&lang=it&units=metric&appid=' + apikey, {
                    method: 'GET'
                })
            } catch (error) {
            }
        },
        async getAirQuality() {
            const config = useRuntimeConfig().public
            const url = config['WEATHER_URL']
            const apikey = config['WEATHER_API_KEY']
            try {
                this.airQuality = await $fetch(url + '/air_pollution?lat=' + this.city.lat + '&lon=' + this.city.lon + '&lang=it&appid=' + apikey, {
                    method: 'GET'
                })
            } catch (error) {
            }
        },
    }
})