// ChartDataHelper.tsx

// Interface for temperature records input
export interface TemperatureRecord {
  [key: string]: number[]; // Key is date.getTime(), value is an array of temperatures
}

// Interface for the chart data output
export interface ChartData {
  x: Date;
  y: number;
}

export const THERMAL_THRESHOLDS = [
  28, 28, 29, 29, 30, 31, 32, 33, 32, 31, 29, 28,
];

// Utility function to group temperature records by day
const groupByDay = (
  temperatureRecord: TemperatureRecord,
): Record<string, number[]> => {
  const grouped: Record<string, number[]> = {};

  Object.entries(temperatureRecord).forEach(([timestamp, temperature]) => {
    const date = new Date(parseInt(timestamp));
    // Create a date string that only includes the year, month, and day
    const dateString = date.toISOString().split('T')[0];

    if (!grouped[dateString]) {
      grouped[dateString] = [];
    }
    grouped[dateString].push(temperature);
  });

  return grouped;
};

// Convert temperature records to chart data, considering the updated structure
export const convertTemperatureRecordsToChartData = (
  temperatureRecord: TemperatureRecord,
  deviceInterval: number = 20 * 60,
  thermalThresholds: number[] = THERMAL_THRESHOLDS,
): ChartData[] => {
  // First, group temperature records by day
  const groupedRecords = groupByDay(temperatureRecord);

  return Object.entries(groupedRecords).map(([dateString, temperatures]) => {
    const date = new Date(dateString);
    const month = date.getMonth();
    const threshold = thermalThresholds[month];

    const intervalsAboveThreshold = temperatures.filter(
      temp => temp > threshold,
    ).length;

    // deviceInterval is in ms format
    const hoursOfWearing = intervalsAboveThreshold * (deviceInterval / 1000) / 3600

    return {x: date, y: hoursOfWearing};
  });
};
