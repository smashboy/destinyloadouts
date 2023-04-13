export const hasAnHourPassed = (date: Date) => {
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();

  const diffHrs = Math.floor((diffMs % 86400000) / 3600000);

  return diffHrs >= 1;
};
