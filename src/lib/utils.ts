/**
 * Sleep for number of milliseconds
 * @param duration Sleep duration in milliseconds
 */
export const sleep = (duration: number) => {
  const start = Date.now();
  for (let i = 0; i < 1e7; i++) {
    if ((Date.now() - start) > duration) {
      break;
    }
  }
};

export const formatDateString = (value?: Date | string | number) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.valueOf())) return "";
  return date.toLocaleDateString(
    'en-GB',
    { day: '2-digit', month: '2-digit', year: "numeric" }
  );
};