export function getFormattedDate(): string {
  const date = new Date();
  const str =
    date.getDate() +
    "." +
    (date.getMonth() + 1) +
    "." +
    date.getFullYear() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes();

  return str;
}
