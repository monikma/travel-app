// Personal API Key for OpenWeatherMap API
const apiKey = '&username=monikma'
const postalCodesURL = 'http://api.geonames.org/postalCodeSearch?placename='
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

    getPostalCode(postalCodesURL, city, apiKey)
        .then(postalCode => createTrip(baseURL, {
            city: city,
            postalCode: postalCode,
            date: date
        }))
        .then(() => getData(baseURL))
        .then(data => updateUi(data))
}

/* Function to GET Web API Data*/
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
            return newData.postalCodes[0].postalCode
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
        city.innerHTML = "To: " + data.city
        tripCard.appendChild(city)

        const weather = document.createElement("div")
        weather.innerHTML = "Weather: " + data.weather
        tripCard.appendChild(weather)
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
    return 1209 //TODO
}

// Print error
function internalError() {
    error("Sorry there was a problem completing your request, please try later.")
}

function error(msg) {
    alert(msg)
}

export { addTripClicked, init }