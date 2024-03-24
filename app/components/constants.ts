export const THERMAL_THRESHOLDS = [
  28, 28, 29, 29, 30, 31, 32, 33, 32, 31, 29, 28,
];

export const EVENT_TYPES = {
  0: 'Configuration is empty',
  1: 'Configuration has set',
  2: 'Temperature measurement is started',
  3: 'Event logging is ongoing',
  4: 'Temperature measure is stopped',
  5: 'At least one temperature measurement is above threashold',
  6: 'At least one temperature measurement is below threshold',
  7: 'Low battery, please replace a new battery',
  8: 'Memory is full, does not record more data',
};
