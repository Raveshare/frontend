export const utilXtimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.valueOf() - date.valueOf()) / 1000);

  let interval = seconds / 31536000; // Calculate years

  if (interval > 1) {
    return Math.floor(interval) + "years";
  }
  interval = seconds / 2592000; // Calculate months
  if (interval > 1) {
    return Math.floor(interval) + "months";
  }
  interval = seconds / 86400; // Calculate days
  if (interval > 1) {
    return Math.floor(interval) + "days";
  }
  interval = seconds / 3600; // Calculate hours
  if (interval > 1) {
    return Math.floor(interval) + "hours";
  }
  interval = seconds / 60; // Calculate minutes
  if (interval > 1) {
    return Math.floor(interval) + "mins";
  }
  return Math.floor(seconds) + "secs";
};
