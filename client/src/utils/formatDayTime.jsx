export function formatDateTime(isoDateTime) {
  const date = new Date(isoDateTime);

  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour12: false,
    timeZone: 'UTC'
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
}
