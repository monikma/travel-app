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

module.exports = { parseDate, getHistoricalDate, getOneDayLater, daysBetween }