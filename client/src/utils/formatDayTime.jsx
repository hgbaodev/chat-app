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

export const formatTimeRecord = (seconds) => {
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const ss = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor((seconds - Math.floor(seconds)) * 10)
    .toString()
    .padStart(2, '0');
  return `${mm}:${ss}:${s}`;
};

export const formatSeconds = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
};
