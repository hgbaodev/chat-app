import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

export function formatTimeAgo(timestamp, locale = 'en-US') {
  if (!(timestamp instanceof Date)) {
    timestamp = new Date(timestamp);
  }
  const timeAgo = new TimeAgo(locale);
  return timeAgo.format(timestamp, 'mini-minute-now');
}
