export function getFormattedDate(): string {
    const { getDate, getMonth, getFullYear, getHours, getMinutes } = new Date()

    return `${getDate()}.${getMonth() + 1}.${getFullYear()} ${getHours()}:${getMinutes()}`
}
