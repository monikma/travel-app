// Personal API Key for OpenWeatherMap API
const postalCodesUsername = '&username=monikma'
const postalCodesURL = 'http://api.geonames.org/postalCodeSearch?placename='

const weatherURL = 'http://api.weatherbit.io/v2.0/history/daily'
const weatherApiKey= '?key=77732ac5c3e04125a28209f311634d7d'

const pixabayURL = 'https://pixabay.com/api/?image_type=photo&q='
const pixabayApiKey= '&key=16662631-9cbc21132648511fe8b2b6986'

const baseURL = 'http://localhost:8000/trips'

function init(){
    // init UI
    getData(baseURL).then(data => updateUi(data))
}

// Event listener to add function to existing HTML DOM element
function addTripClicked(event) {
    const city = document.getElementById('city').value
    const date = document.getElementById('date').value

    if (!city || !date){
        alert("You need to provide both the city and the date of the trip.")
        return
    }

    getPostalCode(postalCodesURL, city, postalCodesUsername)
        .then(postalCodeResult => getWeather(weatherURL,
            postalCodeResult.code,
            postalCodeResult.country,
            getHistoricalDate(date),
            weatherApiKey))
        .then(weatherResult => createTrip(baseURL, {
            city: city,
            country: weatherResult.country,
            postalCode: weatherResult.postalCode,
            weather_max: weatherResult.weather_max,
            weather_min: weatherResult.weather_min,
            date: date
        }))
        .then(() => getData(baseURL))
        .then(data => updateUi(data))
}

const getPostalCode = async (url, city, key) => {
    const response = await fetch(url + city + key, {
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      //credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Accept': 'application/json'
      }
    })
    try {
        if (response.status != 200) {
            internalError()
        } else {
            const newData = await response.json()
            if(newData.postalCodes.length>0){
                return {
                    "code" : newData.postalCodes[0].postalCode,
                    "country" : newData.postalCodes[0].countryCode
                }
            }else{
                alert("Could not find such city")
            }
        }
    } catch (error) {
        console.log("error", error)
        internalError()
    }
}

const getWeather = async (url, postalCode, country, date, key) => {
    const response = await fetch(url + key +
        "&start_date=" + date +
        "&end_date=" + getOneDayLater(date) +
        "&postal_code=" + postalCode +
        "&country=" + country)
    try {
        if (response.status != 200) {
            internalError()
        } else {
            const newData = await response.json()
            return {
                "weather_max" : newData.data[0].max_temp,
                "weather_min" : newData.data[0].min_temp,
                "postalCode" : postalCode,
                "country" : country
            }
        }
    } catch (error) {
        console.log("error", error)
        internalError()
    }
}

const fetchImage = async (url, city, key) => {
    const response = await fetch(url + city + key)
    try {
        if (response.status != 200) {
            internalError()
        } else {
            const newData = await response.json()
            if(newData.total>0){
                return newData.hits[0].previewURL
            } else {
                return null
            }
        }
    } catch (error) {
        console.log("error", error)
        internalError()
    }
}

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
        if (response.status != 201) {
            internalError()
        } else {
            document.getElementById('city').value = ""
            document.getElementById('date').value = ""
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

        const weather = document.createElement("div")
        weather.innerHTML = "Weather: high " + data.weather_max + ", low " + data.weather_min
        tripCard.appendChild(weather)

        fetchImage(pixabayURL, data.city, pixabayApiKey).then(url => {
            const img = document.createElement("img")
            img.setAttribute("src", url)
            tripCard.appendChild(img)
        })

    })
    entryHolder.appendChild(fragment)

}

/* Global Variables */

// Create a new date instance dynamically with JS
function getCurrentDate() {
    let d = new Date()
    return (d.getMonth() + 1) + '.' + d.getDate() + '.' + d.getFullYear()
}

function getCountdown(strDate){
    return daysBetween(new Date(), parseDate(strDate))
}

// Print error
function internalError() {
    error("Sorry there was a problem completing your request, please try later.")
}

function error(msg) {
    alert(msg)
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
    return new Date(nowDate.getYear()+1900-1, date[1]-1, date[2]).toISOString().split("T")[0]
}

/**
*   Returns the date one day later.
**/
function getOneDayLater(str) {
    const dateArr = str.split('-')
    const date = new Date(dateArr[0], dateArr[1]-1, dateArr[2])
    date.setDate(date.getDate() + 2);
    return date.toISOString().split("T")[0]
}

function daysBetween(date1, date2) {
    return Math.round((date2-date1)/(1000*60*60*24))
}


export { addTripClicked, init }