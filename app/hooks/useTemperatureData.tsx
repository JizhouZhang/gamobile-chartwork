import {useState} from 'react';

import NfcManager, {NfcTech, Ndef, TagEvent} from 'react-native-nfc-manager';

import mockdata from '../../mockdata/data.json';

NfcManager.start();

interface TemperatureData {
  values: number[];
}

export const useTemperatureData = () => {
  const [logs, setLogs] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanningStatus, setScanningStatus] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [deviceInterval, setDeviceInterval] = useState(0);
  const [temperatureData, setTemperatureData] = useState<TemperatureData>({
    values: [],
  });

  const delay = (delayInms: number) => {
    console.log('delay', delayInms);
    return new Promise(resolve => setTimeout(resolve, delayInms));
  };

  const appendLog = (message: string) => {
    console.log(message);
    const timestamp = new Date().toLocaleTimeString();
    const newLog = `${timestamp}: ${message}`;

    // Using a callback function with setLogs to ensure we get the most current state
    setLogs(prevLogs => {
      // prevLogs is the current state at the time this update is applied
      return [...prevLogs, newLog];
    });
  };

  async function getAllMeasurements() {
    setIsScanning(true);
    appendLog('Scanning for NFC tags...');
    var offset = 0;
    var total_num_measurement = 0;
    let device_interval = 20 * 60 * 1000; // 20 minutes
    let start_delay = 0;
    let running_time = 0;
    let device_factor = 1;

    const measurements = [];
    setScanningStatus('Get Device Configuration');
    const get_config_cmd = [72, 0];
    const resp = mockdata.config;

    if (resp) {
      for (let i = 0; i < resp.ndefMessage.length; i++) {
        if (resp.ndefMessage[i].payload[0] == 72) {
          total_num_measurement = mockdata.tempdata.length;
          appendLog(`total_num_measurement: ${total_num_measurement}`);

          device_interval = 20 * 60; // hardcoded to 20 minutes
          device_interval = device_interval * 1000; // convert to milliseconds
          appendLog(`device_interval: ${device_interval}`);

          start_delay =
            resp.ndefMessage[i].payload[12] +
            (resp.ndefMessage[i].payload[13] << 8) +
            (resp.ndefMessage[i].payload[14] << 16) +
            (resp.ndefMessage[i].payload[15] << 24);
          appendLog(`start_delay: ${start_delay}`);

          running_time =
            resp.ndefMessage[i].payload[16] +
            (resp.ndefMessage[i].payload[17] << 8) +
            (resp.ndefMessage[i].payload[18] << 16) +
            (resp.ndefMessage[i].payload[19] << 24);

          appendLog(`running_time: ${running_time}`);

          const device_status =
            resp.ndefMessage[i].payload[30] +
            (resp.ndefMessage[i].payload[31] << 8) +
            (resp.ndefMessage[i].payload[32] << 16) +
            (resp.ndefMessage[i].payload[33] << 24);
          appendLog(`device_status: ${device_status}`);

          const startTimeTs =
            new Date().getTime() / 1000 -
            (device_interval / 1000) * total_num_measurement;

          let deviceCurrentTimeTs = new Date().getTime() / 1000;
          const sysCurrentTime = new Date();
          appendLog(
            `device current time: ${new Date(deviceCurrentTimeTs * 1000)}, ` +
              `measure start time: ${new Date(startTimeTs * 1000)}, ` +
              `system current time: ${sysCurrentTime}}`,
          );
          device_factor =
            (sysCurrentTime.getTime() / 1000 - startTimeTs) /
            (deviceCurrentTimeTs - startTimeTs);
          appendLog(`device Factor: ${device_factor}`);

          const startDateTime = new Date(startTimeTs * 1000);
          let actualInterval = device_interval * device_factor;
          console.log(`actual interval: ${actualInterval}`);
          setDeviceInterval(actualInterval);

          let measuredEndTime = new Date(
            startDateTime.getTime() + actualInterval * total_num_measurement,
          );
          appendLog(`actual end time: ${measuredEndTime}`);
          setStartDate(startDateTime);
          setEndDate(measuredEndTime);
        }
      }
    }

    await delay(1000); // delay 1 second
    setScanningStatus('Get Device ID');
    let device_id = undefined;

    const get_nfc_id_cmd = [9, 0];
    // const id_resp = await sendMsgGetResponseRetry(get_nfc_id_cmd);
    const id_resp = mockdata.id;

    if (id_resp) {
      let uid = [
        id_resp.ndefMessage[0].payload[2],
        id_resp.ndefMessage[0].payload[3],
        id_resp.ndefMessage[0].payload[4],
        id_resp.ndefMessage[0].payload[5],
      ];
      uid.reverse();
      // convert to hex string
      uid = uid.map(x => x.toString(16)).join(':');
      // capitalize uid
      uid = uid.toUpperCase();
      console.log('get UID:' + uid);
      device_id = uid;
    } else {
      console.log('get UID failed!');
    }
    appendLog(
      `Total number of measurements: ${total_num_measurement}, device UID: ${device_id}`,
    );

    setScanningStatus('Start reading measurements');
    while (offset < total_num_measurement) {
      measurements.push(...mockdata.tempdata);
      setScanningStatus(`Reading progress: 100%`);
      offset = total_num_measurement;
    }

    await NfcManager.cancelTechnologyRequest();
    const decodedTemperatures = decodeTemperatures(measurements);
    appendLog(`Done, Measurement length: ${measurements.length}`);
    setIsScanning(false);
    setTemperatureData({values: decodedTemperatures});

    return decodedTemperatures;
  }

  async function sendMsgGetResponseRetry(command: number[]) {
    const MAX_NUM_TRY = 100;
    let ret = null;
    try {
      let i = 0;

      const bytes = Ndef.encodeMessage([
        Ndef.record(Ndef.TNF_MIME_MEDIA, Ndef.RTD_TEXT, '0', command),
      ]);
      appendLog(`encodeMessage: ${bytes}`);

      for (i = 0; i < MAX_NUM_TRY; i++) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes, {
          reconnectAfterWrite: true,
        });
        appendLog('writeNdefMessage completed');
        ret = await NfcManager.ndefHandler.getNdefMessage();
        if (ret && ret.ndefMessage) {
          if (ret.ndefMessage[0].payload[1] === 1) {
            // this is the response from the sensor
            break;
          }
        }
      }

      if (i === MAX_NUM_TRY) {
        console.error('Exceed maximum retry sending and receiving command');
      }
    } catch (ex) {
      console.warn('NFC Failed:', ex);
    }
    return ret;
  }

  function decodeTemperatures(data: number[]): number[] {
    let temperatures: number[] = [];
    for (let i = 0; i < data.length; i += 1) {
      let temperatureValue = data[i] + 23;
      temperatures.push(temperatureValue);
    }

    return temperatures;
  }

  // Add more logic here as needed for handling NFC data, storing/retrieving temperature data, etc.
  // console.log(logs);
  return {
    temperatureData,
    getAllMeasurements,
    isScanning,
    scanningStatus,
    startDate,
    endDate,
    deviceInterval,
  };
};
