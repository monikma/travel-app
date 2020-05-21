const pixabayURL = 'https://pixabay.com/api/?image_type=photo&q='
const pixabayApiKey= '&key=16662631-9cbc21132648511fe8b2b6986'

// NOTE: You will need Access-Control-Allow-origin plugin to ignore CORS errors
const fetchImage = async (city, countryFallback) => {
    const imgURL = fetchImg(pixabayURL, city, pixabayApiKey)
    if (imgURL) {
        return imgURL
    } else { // country fallback
        return fetchImg(pixabayURL, countryFallback, pixabayApiKey)
    }
}

const fetchImg = async(url, query, key) => {
    const response = await fetch(url + query + key)
    try {
        if (response.status != 200) {
            console.log("error", response)
            return null
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
        return null
    }
}

export { fetchImage }