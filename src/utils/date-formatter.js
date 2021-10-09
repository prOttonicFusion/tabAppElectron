const format = require('date-fns').format

const getFormattedDate = () => {
    const date = new Date()

    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
}

const formatToISO = (date) => {
    return format(date, 'yyyy-MM-dd')
}

const formatToISOWithTimeStamp = (date) => {
    return format(date, 'yyyy-MM-dd_hh-mm')
}


module.exports = {
    getFormattedDate,
    formatToISO,
    formatToISOWithTimeStamp,
}
