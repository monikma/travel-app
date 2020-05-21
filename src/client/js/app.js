// Personal API Key for OpenWeatherMap API
const apiKey = '&username=monikma'
const postalCodesURL = 'http://api.geonames.org/postalCodeSearch?placename='
const baseURL = 'http://localhost:8000/trips'

// Event listener to add function to existing HTML DOM element
function addTripClicked(event) {
    const city = document.getElementById('city').value
    const feelings = document.getElementById('feelings').value
    if (city && feelings) {
        getPostalCode(postalCodesURL, city, apiKey)
            .then(postalCode => createTrip(baseURL, {
                postalCode: postalCode,
                feelings: feelings,
                date: getCurrentDate()
            }))
            .then(() => getData(baseURL))
            .then(data => updateUi(data))
    } else {
        alert("You need to provide both the city and how you are feeling.")
    }
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
    entryHolder.firstElementChild.remove()
    const fragment = document.createDocumentFragment()
    trips.forEach(function(data){
        const tripCard = document.createElement("div")
        fragment.appendChild(tripCard)

        const date = document.createElement("div")
        date.setAttribute("id", "date")
        date.innerHTML = data.date
        tripCard.appendChild(date)

        const weather = document.createElement("div")
        weather.setAttribute("id", "temp")
        weather.innerHTML = data.postalCode
        tripCard.appendChild(weather)

        const feelings = document.createElement("div")
        feelings.setAttribute("id", "content")
        feelings.innerHTML = data.feelings
        tripCard.appendChild(feelings)
    })
    entryHolder.appendChild(fragment)

}

/* Global Variables */

// Create a new date instance dynamically with JS
function getCurrentDate() {
    let d = new Date()
    return (d.getMonth() + 1) + '.' + d.getDate() + '.' + d.getFullYear()
}

// Print error
function internalError() {
    error("Sorry there was a problem completing your request, please try later.")
}

function error(msg) {
    alert(msg)
}

export { addTripClicked }