const postalCodesUsername = '&username=monikma'
const postalCodesURL = 'http://api.geonames.org/postalCodeSearch?placename='

// NOTE: You will need Access-Control-Allow-origin plugin to ignore CORS errors
const getPostalCode = async (city) => {
    const response = await fetch(postalCodesURL + city + postalCodesUsername, {
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Accept': 'application/json'
      }
    })
    try {
        if (response.status != 200) {
            console.log("error", response)
        } else {
            const newData = await response.json()
            if(newData.postalCodes.length>0){
                return {
                    "code" : newData.postalCodes[0].postalCode,
                    "countryCode" : newData.postalCodes[0].countryCode
                }
            }else{
                alert("Could not find such city")
            }
        }
    } catch (error) {
        console.log("error", error)
    }
}

export { getPostalCode }