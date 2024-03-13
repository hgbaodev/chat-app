import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

export function formatTimeAgo(timestamp, locale = 'en-US') {
  if (!(timestamp instanceof Date)) {
    timestamp = new Date(timestamp);
  }

  const timeAgo = new TimeAgo(locale);
  return timeAgo.format(timestamp);
}

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
