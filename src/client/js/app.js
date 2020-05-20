// Personal API Key for OpenWeatherMap API
const apiKey = '&appid=a8e0f9e6690428bc6ff0a514cb07c017';
const weatherURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const baseURL = 'http://localhost:8000/projectData';

// Event listener to add function to existing HTML DOM element
function performAction(event) {
    const zip = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;
    if (zip && feelings) {
        getTemp(weatherURL, zip, apiKey)
            .then(temp => postData(baseURL, {
                weather: temp,
                feelings: feelings,
                date: getCurrentDate()
            }))
            .then(() => getData(baseURL))
            .then(data => updateUi(data));
    } else {
        alert("You need to provide both your Zip code and how you are feeling.");
    }
}

/* Function called by event listener */
document.getElementById('generate').addEventListener('click', performAction);

/* Function to GET Web API Data*/
const getTemp = async (url, zip, key) => {
    const response = await fetch(url + zip + key);
    try {
        if (response.status == 404) {
            error("The zip code could not be recognized, please enter a valid US zip code.")
        } else if (response.status != 200) {
            internalError();
        } else {
            const newData = await response.json();
            return newData.main.temp;
        }
    } catch (error) {
        console.log("error", error);
        internalError();
    }
}

/* Function to POST data */
const postData = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        // Body data type must match "Content-Type" header
        body: JSON.stringify(data),
    });

    try {
        if (response.status != 201) {
            internalError();
        }
    } catch (error) {
        console.log("error", error);
        internalError();
    }
}

/* Function to GET Project Data */
const getData = async (url) => {
    const response = await fetch(url);
    try {
        if (response.status != 200) {
            internalError();
        } else {
            const newData = await response.json();
            return newData;
        }
    } catch (error) {
        console.log("error", error);
        internalError();
    }
}

/* Function to update UI*/
const updateUi = async (data) => {
    const entryHolder = document.getElementById("entryHolder");
    entryHolder.querySelector("#date").innerHTML = data.date;
    entryHolder.querySelector("#temp").innerHTML = data.weather;
    entryHolder.querySelector("#content").innerHTML = data.feelings;
}

/* Global Variables */

// Create a new date instance dynamically with JS
function getCurrentDate() {
    let d = new Date();
    return (d.getMonth() + 1) + '.' + d.getDate() + '.' + d.getFullYear();
}

// Print error
function internalError() {
    error("Sorry there was a problem completing your request, please try later.");
}

function error(msg) {
    alert(msg);
}