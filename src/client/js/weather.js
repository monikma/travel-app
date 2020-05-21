const weatherURL = 'http://api.weatherbit.io/v2.0/history/daily'
const weatherApiKey= '?key=77732ac5c3e04125a28209f311634d7d'

// NOTE: You will need Access-Control-Allow-origin plugin to ignore CORS errors
const getWeather = async (postalCode, countryCode, startDate, endDate) => {
    const response = await fetch(weatherURL + weatherApiKey +
        "&start_date=" + startDate.toISOString().split("T")[0] +
        "&end_date=" + endDate.toISOString().split("T")[0] +
        "&postal_code=" + postalCode +
        "&country=" + countryCode)
    try {
        if (response.status != 200) {
            console.log("error", response)
        } else {
            const newData = await response.json()
            return {
                "weather_max" : newData.data[0].max_temp,
                "weather_min" : newData.data[0].min_temp,
                "postalCode" : postalCode,
                "countryCode" : countryCode
            }
        }
    } catch (error) {
        console.log("error", error)
    }
}

export { getWeather }