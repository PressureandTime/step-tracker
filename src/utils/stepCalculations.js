// Shared step calculations utilities
export const STEP_LENGTH = 0.762; // Average step length in meters

export const calculateDistance = (steps) => {
  const distanceInMeters = steps * STEP_LENGTH;
  return (distanceInMeters / 1000).toFixed(2);
};

export const calculateCalories = (steps) => {
  // Average calories burned per step (0.04 calories/step)
  return Math.round(steps * 0.04);
};

export const calculatePace = (steps, distance) => {
  if (!steps || !distance) return '0:00';
  const minutesPerKm = (60 / (distance / 1000)).toFixed(0);
  return `${minutesPerKm}:00`;
};
