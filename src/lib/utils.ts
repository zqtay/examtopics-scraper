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