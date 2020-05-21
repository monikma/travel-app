const dateUtils = require("./dateUtils")
const countries = require("i18n-iso-countries")
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

const baseURL = 'http://localhost:8000/trips'

import { getPostalCode } from './postalCodes'
import { fetchImage } from './pixabay'
import { getWeather } from './weather'

function initUi(){
    // init UI
    getData(baseURL).then(data => updateUi(data))
}

// Event listener to add function to existing HTML DOM element
function addTrip(event) {
    const city = document.getElementById('city').value
    const date = document.getElementById('date').value

    if (!city || !date){
        alert("You need to provide both the city and the date of the trip.")
        return
    }

    getPostalCode(city)
        .then(postalCodeResult => getWeather(
            postalCodeResult.code,
            postalCodeResult.countryCode,
            getHistoricalDate(date),
            dateUtils.getOneDayLater(dateUtils.getHistoricalDate(date))))
        .then(weatherResult => {
        return createTrip(baseURL, {
            city: city,
            country: countries.getName(weatherResult.countryCode, "en"),
            postalCode: weatherResult.postalCode,
            weather_max: weatherResult.weather_max,
            weather_min: weatherResult.weather_min,
            date: date}
        )})
        .then(() => initUi())
}

/**
*  External API calls
*/

/* Function to POST data */
const createTrip = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        // Body data type must match "Content-Type" header
        body: JSON.stringify(data),
    })

    try {
        if (response.status == 201) {
            // clear inputs so that it is clear that it worked
            document.getElementById('city').value = ""
            document.getElementById('date').value = ""
        } else {
            internalError()
        }
    } catch (error) {
        console.log("error", error)
        internalError()
    }
}

/* Function to GET Project Data */
const getData = async (url) => {
    const response = await fetch(url)
    try {
        if (response.status != 200) {
            internalError()
        } else {
            const newData = await response.json()
            return newData
        }
    } catch (error) {
        console.log(error)
        internalError()
    }
}

/* Function to update UI*/
const updateUi = async (trips) => {
    const entryHolder = document.getElementById("entryHolder")
    const previousData = entryHolder.firstElementChild
    if (previousData) previousData.remove()
    const fragment = document.createDocumentFragment()
    trips.forEach(function(data){
        const tripCard = document.createElement("div")
        tripCard.setAttribute("class", "trip")
        fragment.appendChild(tripCard)

        const date = document.createElement("div")
        date.innerHTML = "Date: " + data.date
        tripCard.appendChild(date)

        const countdown = document.createElement("div")
        countdown.innerHTML = "In " + getCountdown(data.date) + " days"
        tripCard.appendChild(countdown)

        const city = document.createElement("div")
        city.innerHTML = "To: " + data.city + " in " + data.country
        tripCard.appendChild(city)

        const zip = document.createElement("div")
        zip.innerHTML = "Postal code: " + data.postalCode
        tripCard.appendChild(zip)

        fetchImage(data.city, data.country).then(url => {
            const img = document.createElement("img")
            img.setAttribute("src", url)
            tripCard.appendChild(img)

            const weather = document.createElement("div")
            weather.innerHTML = "Average weather: high " + data.weather_max + ", low " + data.weather_min
            tripCard.appendChild(weather)
        })
    })
    entryHolder.appendChild(fragment)

}

/* Helper functions: */

// Print error
function internalError() {
    error("Sorry there was a problem completing your request, please try later.")
}

function error(msg) {
    alert(msg)
}

function getCountdown(strDate){
    return dateUtils.daysBetween(new Date(), parseDate(strDate))
}

function parseDate(str) {
    const date = str.split('-')
    return new Date(date[0], date[1]-1, date[2])
}

/**
*   Returns the date of the same day last year.
**/
function getHistoricalDate(str) {
    const date = str.split('-')
    const nowDate = new Date()
    // The value returned by getYear is the current year minus 1900.
    return new Date(nowDate.getYear()+1900-1, date[1]-1, date[2])
}

/**
*   Returns the date one day later.
**/
function getOneDayLater(date) {
    date.setDate(date.getDate() + 1)
    return date
}

function daysBetween(date1, date2) {
    return Math.round((date2-date1)/(1000*60*60*24))
}

export { addTrip, initUi }