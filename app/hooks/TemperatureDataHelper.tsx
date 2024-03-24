import RtcAccuracyHelper from './RtcAccuracyHelper';

import RNFS from 'react-native-fs';

type TemperatureRecord = {
  [timestamp: number]: number;
};

export class TemperatureDataHelper {
  /**
   * Generates a dictionary with corrected timestamps as keys and temperatures as values.
   * @param temperatures Array of temperature readings.
   * @param startTime Start time as a Date object.
   * @param endTime End time as a Date object.
   * @param interval Interval between temperature readings in milliseconds.
   * @returns {TemperatureRecord} A dictionary with corrected timestamps as keys and temperatures as values.
   */
  public static generateTemperatureRecords(
    temperatures: number[],
    startTime: Date,
    endTime: Date,
    interval: number,
  ): TemperatureRecord {
    const temperatureRecord: TemperatureRecord = {};
    const startTimeMs = startTime.getTime();
    const endTimeMs = endTime.getTime();
    const totalDuration = endTimeMs - startTimeMs;

    // Calculate the expected number of temperature readings based on the interval and duration
    const expectedCount = Math.floor(totalDuration / interval);
    if (temperatures.length !== expectedCount) {
      console.warn(
        `Expected ${expectedCount} temperature readings, but got ${temperatures.length}.`,
      );
    }

    for (let i = 0; i < temperatures.length; i++) {
      // Calculate the original timestamp for this temperature reading
      const originalTimestamp = new Date(startTimeMs + i * interval);
      // Correct the timestamp using the RTC correction helper
      const correctedTimestamp =
        RtcAccuracyHelper.correctedTimestamp(originalTimestamp);

      // Use the corrected timestamp as the key in the temperature record
      temperatureRecord[correctedTimestamp.getTime()] = temperatures[i];
    }

    return temperatureRecord;
  }

  /**
   * Exports temperature records as a CSV file.
   * @param temperatureRecord The temperature record dictionary.
   * @param fileName Optional. The name of the file without extension.
   */
  public static async exportTemperatureRecordsToCSV(
    temperatureRecord: TemperatureRecord,
    fileName: string = 'timestamp_and_temperature',
  ): Promise<void> {
    let csvContent = 'Timestamp,Temperature\n';
    Object.keys(temperatureRecord).forEach(timestamp => {
      const temperature = temperatureRecord[timestamp];
      csvContent += `${timestamp},${temperature}\n`;
    });

    // Define the file path
    const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}.csv`;

    // Write the file
    try {
      await RNFS.writeFile(filePath, csvContent, 'utf8');
      console.log(`CSV file written successfully at: ${filePath}`);
    } catch (error) {
      console.error('Failed to write CSV file:', error);
    }
  }
}

export default TemperatureDataHelper;
