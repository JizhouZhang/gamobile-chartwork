import React, {useState} from 'react';
import {View, ScrollView, Text, Button, StyleSheet} from 'react-native';
import NfcManager, {NfcTech, Ndef, TagEvent} from 'react-native-nfc-manager';
import {EVENT_TYPES} from '../components/constants';
import {TemperatureDataHelper} from '../hooks/TemperatureDataHelper';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import ButtonView from '../components/ButtonView';
import Images from '../theme/Images';

// Pre-step, call this before any NFC operations
NfcManager.start();

function ConfigScreen() {
  const [logs, setLogs] = useState([]);
  // Add current tag configuration to state
  // const [config, setConfig] = useState<Config>();
  async function sendMsgGetResponse(command: number[]) {
    let ret;
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);

      const bytes = Ndef.encodeMessage([
        Ndef.record(Ndef.TNF_MIME_MEDIA, Ndef.RTD_TEXT, '0', command),
      ]);
      appendLog(`encodeMessage: ${bytes}`);

      await NfcManager.ndefHandler.writeNdefMessage(bytes, {
        reconnectAfterWrite: true,
      });
      appendLog('writeNdefMessage completed');

      ret = await NfcManager.ndefHandler.getNdefMessage();
    } catch (ex) {
      console.warn('NFC Failed:', ex);
    } finally {
      await NfcManager.cancelTechnologyRequest();
    }
    return ret;
  }

  async function shareCsvByEmail(
    fileName: string = 'timestamp_and_temperature',
  ) {
    console.log('fileName:', fileName);
    const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}.csv`;
    const fileUri = `file://${filePath}`;
    console.log(`fileUri: ${fileUri}`);

    try {
      const result = await Share.open({
        subject: 'Temperature Records',
        message: 'Please find attached the temperature records.',
        url: fileUri, // Attach the file using the file URI
        type: 'text/csv', // Set MIME type as CSV
      });

      console.log(result);
    } catch (error) {
      console.error('Error sharing CSV file:', error);
    }
  }

  async function sendMsgGetResponseRetry(command: number[]) {
    const MAX_NUM_TRY = 100;
    let ret = null;
    try {
      let i = 0;

      const bytes = Ndef.encodeMessage([
        Ndef.record(Ndef.TNF_MIME_MEDIA, Ndef.RTD_TEXT, '0', command),
      ]);
      console.log(`encodeMessage: ${bytes}`);

      for (i = 0; i < MAX_NUM_TRY; i++) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes, {
          reconnectAfterWrite: true,
        });
        console.log('writeNdefMessage completed');
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

  const delay = (delayInms: number) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
  };

  async function getConfiguration() {
    // decimal 72 -> command to get configuration.
    const get_config_cmd = [72, 0];
    const resp = await sendMsgGetResponse(get_config_cmd);

    if (resp) {
      for (let i = 0; i < resp.ndefMessage.length; i++) {
        console.log('Jay debug:', resp.ndefMessage[i].payload);
        if (resp.ndefMessage[i].payload[0] === 72) {
          appendLog(`config: ${resp.ndefMessage[i].payload}`);
          const result =
            resp.ndefMessage[i].payload[2] +
            (resp.ndefMessage[i].payload[3] << 8) +
            (resp.ndefMessage[i].payload[4] << 16) +
            (resp.ndefMessage[i].payload[5] << 24);

          appendLog(`Result: ${result}`);
          const configTs =
            resp.ndefMessage[i].payload[6] +
            (resp.ndefMessage[i].payload[7] << 8) +
            (resp.ndefMessage[i].payload[8] << 16) +
            (resp.ndefMessage[i].payload[9] << 24);
          // convert ts to date for appending to logs
          const configTsDate = new Date(configTs * 1000);
          appendLog(`Config Time: ${configTsDate}`);

          const interval =
            resp.ndefMessage[i].payload[10] +
            (resp.ndefMessage[i].payload[11] << 8);
          appendLog(`interval: ${interval}`);

          const startDelay =
            resp.ndefMessage[i].payload[12] +
            (resp.ndefMessage[i].payload[13] << 8) +
            (resp.ndefMessage[i].payload[14] << 16) +
            (resp.ndefMessage[i].payload[15] << 24);
          appendLog(`startDelay: ${startDelay}`);
          const runningTime =
            resp.ndefMessage[i].payload[16] +
            (resp.ndefMessage[i].payload[17] << 8) +
            (resp.ndefMessage[i].payload[18] << 16) +
            (resp.ndefMessage[i].payload[19] << 24);

          appendLog(`runningTime: ${runningTime}`);

          // running time is in seconds, convert to easy to read format
          const runningTimeString = `${Math.floor(
            runningTime / 86400,
          )} days, ${Math.floor(runningTime / 3600)} hours, ${Math.floor(
            runningTime / 60,
          )} minutes, ${runningTime % 60} seconds`;
          appendLog(`runningTimeStr: ${runningTimeString}`);

          appendLog(
            'validMinimum:',
            resp.ndefMessage[i].payload[20] +
              (resp.ndefMessage[i].payload[21] << 8),
          );
          appendLog(
            'validMaximum:',
            resp.ndefMessage[i].payload[22] +
              (resp.ndefMessage[i].payload[23] << 8),
          );
          appendLog(
            'attainedMinimum:',
            resp.ndefMessage[i].payload[24] +
              (resp.ndefMessage[i].payload[25] << 8),
          );
          appendLog(
            'attainedMaximum:',
            resp.ndefMessage[i].payload[26] +
              (resp.ndefMessage[i].payload[27] << 8),
          );
          const count =
            resp.ndefMessage[i].payload[28] +
            (resp.ndefMessage[i].payload[29] << 8);
          appendLog(`count: ${count}`);

          const status =
            resp.ndefMessage[i].payload[30] +
            (resp.ndefMessage[i].payload[31] << 8) +
            (resp.ndefMessage[i].payload[32] << 16) +
            (resp.ndefMessage[i].payload[33] << 24);
          appendLog(`status: ${status}`);

          const startTimeTs =
            resp.ndefMessage[i].payload[34] +
            (resp.ndefMessage[i].payload[35] << 8) +
            (resp.ndefMessage[i].payload[36] << 16) +
            (resp.ndefMessage[i].payload[37] << 24);
          const startTimeDate = new Date(startTimeTs * 1000);
          appendLog(`startTime: ${startTimeDate}`);
          const secondsPassedSinceStart =
            resp.ndefMessage[i].payload[38] +
            (resp.ndefMessage[i].payload[39] << 8) +
            (resp.ndefMessage[i].payload[40] << 16) +
            (resp.ndefMessage[i].payload[41] << 24);
          appendLog(
            `secondsPassedSinceStart: ${secondsPassedSinceStart}, start time: ${startTimeTs}`,
          );
          const deviceDateTime = new Date(
            (startTimeTs + secondsPassedSinceStart) * 1000,
          );
          const currentTime = new Date();
          appendLog(`Device Date Time String: ${deviceDateTime}`);
          const actualSecondsSinceStart =
            currentTime.getTime() / 1000 - startTimeTs;
          const factor = actualSecondsSinceStart / secondsPassedSinceStart;
          appendLog(`Factor: ${factor}`);
        }
      }
    } else {
      console.warn('get config failed!');
    }
  }

  async function setConfiguration() {
    await NfcManager.requestTechnology(NfcTech.Ndef);

    const cur_epoch = Date.now() / 1000; // convert from ms to second
    // decimal 73 -> command to set configuration.
    // TODO: update interval to 10 minutes later
    const set_configuration_cmd = [
      73,
      0,
      cur_epoch & 0xff,
      (cur_epoch >> 8) & 0xff,
      (cur_epoch >> 16) & 0xff,
      (cur_epoch >> 24) & 0xff, // currentTime;
      15,
      0, // interval;
      0,
      0,
      0,
      0, // startDelay; set to 0 to start measurement immediately
      0,
      0,
      0,
      0, // runningTime;
      10,
      0, // validMinimum;
      40,
      0,
    ]; // validMaximum;

    const resp = await sendMsgGetResponseRetry(set_configuration_cmd);

    if (resp) {
      appendLog(`set configuration: ${resp}`);
    } else {
      console.warn('set configuration failed!');
    }

    await NfcManager.cancelTechnologyRequest();
  }

  async function getUid() {
    const get_nfc_id_cmd = [9, 0];
    const resp = await sendMsgGetResponse(get_nfc_id_cmd);
    if (resp) {
      // appendLog(`get uid:${resp.ndefMessage}`);
      const uid = [
        resp.ndefMessage[0].payload[2],
        resp.ndefMessage[0].payload[3],
        resp.ndefMessage[0].payload[4],
        resp.ndefMessage[0].payload[5],
      ];
      uid.reverse();
      appendLog(`UID: ${uid}`);
      return uid;
    } else {
      appendLog('get UID failed!');
    }
  }

  async function getVersion() {
    const get_version_cmd = [2, 0];
    const resp = await sendMsgGetResponse(get_version_cmd);

    if (resp) {
      // appendLog(`get version: ${resp.ndefMessage}`);
      const sw_major_ver =
        resp.ndefMessage[0].payload[2] + (resp.ndefMessage[0].payload[3] << 8);
      const sw_minor_ver =
        resp.ndefMessage[0].payload[4] + (resp.ndefMessage[0].payload[5] << 8);
      const api_major_ver =
        resp.ndefMessage[0].payload[6] + (resp.ndefMessage[0].payload[7] << 8);
      const api_minor_ver =
        resp.ndefMessage[0].payload[8] + (resp.ndefMessage[0].payload[9] << 8);
      appendLog(`Firmware ver: ${sw_major_ver}.${sw_minor_ver}`);
      appendLog(`API ver: ${api_major_ver}.${api_minor_ver}`);
    } else {
      console.warn('get version failed!');
    }
  }

  function decodeTemperatures(data: number[]): number[] {
    let temperatures: number[] = [];
    for (let i = 0; i < data.length; i += 1) {
      let temperatureValue = data[i] + 23;
      temperatures.push(temperatureValue);
    }

    return temperatures;
  }

  async function getAllMeasurements() {
    appendLog('Scanning for NFC tags...');
    var offset = 0;
    var total_num_measurement = 0;
    const measurements = [];

    await NfcManager.requestTechnology(NfcTech.Ndef);

    // decimal 72 -> command to get configuration.
    const get_config_cmd = [72, 0];
    const resp = await sendMsgGetResponseRetry(get_config_cmd);

    if (resp) {
      for (let i = 0; i < resp.ndefMessage.length; i++) {
        if (resp.ndefMessage[i].payload[0] == 72) {
          total_num_measurement =
            resp.ndefMessage[i].payload[28] +
            (resp.ndefMessage[i].payload[29] << 8);
        }
      }
    }

    await delay(1000); // delay 1 second

    let device_id = undefined;

    const get_nfc_id_cmd = [9, 0];
    const id_resp = await sendMsgGetResponseRetry(get_nfc_id_cmd);
    if (id_resp) {
      const uid = [
        id_resp.ndefMessage[0].payload[2],
        id_resp.ndefMessage[0].payload[3],
        id_resp.ndefMessage[0].payload[4],
        id_resp.ndefMessage[0].payload[5],
      ];
      uid.reverse();
      console.log('get UID:' + uid);
      device_id = uid;
    } else {
      console.log('get UID failed!');
    }
    appendLog(
      `Total number of measurements: ${total_num_measurement}, device UID: ${device_id}`,
    );

    while (offset < total_num_measurement) {
      // decimal 70 -> command to read temperature.
      // uint16_t offset parameter, set to 0 to read all temperatures.
      const read_all_measurements_cmd = [
        70,
        0,
        offset & 0xff,
        (offset >> 8) & 0xff,
      ];

      try {
        const resp = await sendMsgGetResponseRetry(read_all_measurements_cmd);

        if (resp) {
          offset += resp.ndefMessage[0].payload[8];
          appendLog(`offset: ${offset}`);
          // APP_MSG_RESPONSE_GETMEASUREMENTS_S {
          //     uint32_t result; 4
          //     uint16_t offset; 2
          //     uint8_t count; 1
          //     uint8_t zero[3]; 3
          //     int16_t data[count]; 2 * count
          // } APP_MSG_RESPONSE_GETMEASUREMENTS_T;
          measurements.push(
            ...resp.ndefMessage[0].payload.slice(
              12,
              12 + resp.ndefMessage[0].payload[8],
            ),
          );
          // appendLog(`measurements: ${measurements}`);
          // Append log for the length of the measurements array
          appendLog(`measurements length: ${measurements.length}`);
          const scanningPercentage =
            Math.floor((offset / total_num_measurement) * 10000) / 100;

          appendLog(`Scanning ${scanningPercentage}%`);
        } else {
          console.error('Get measurements failed!');
          break;
        }
      } catch (ex) {
        console.warn('NFC Failed:', ex);
      }
    }

    await NfcManager.cancelTechnologyRequest();
    const decodedTemperatures = decodeTemperatures(measurements);
    appendLog(`Done, Measurement length: ${measurements.length}`);
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 1000 * 60 * 60 * 24 * 90);

    const temperatureRecords = TemperatureDataHelper.generateTemperatureRecords(
      decodedTemperatures,
      startDate,
      endDate,
      20 * 60 * 1000,
    );

    await TemperatureDataHelper.exportTemperatureRecordsToCSV(
      temperatureRecords,
      'temperature_records',
    );

    return measurements;
  }

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

  const clearLogs = () => {
    setLogs([]);
  };

  async function getEvents() {
    await NfcManager.requestTechnology(NfcTech.Ndef);
    var get_events_cmd = [91, 0, 0, 0, 255, 255, 127, 0, 7];

    const resp = await sendMsgGetResponseRetry(get_events_cmd);

    if (resp) {
      appendLog(`get events: ${resp.ndefMessage}`);
      const num_of_events =
        resp.ndefMessage[0].payload[9] + (resp.ndefMessage[0].payload[10] << 8);
      appendLog(`Num of events: ${num_of_events}`);
      for (let i = 0; i < num_of_events; i++) {
        const index =
          resp.ndefMessage[0].payload[11 + 7 * i] +
          (resp.ndefMessage[0].payload[12 + 7 * i] << 8);
        const time_stamp =
          resp.ndefMessage[0].payload[13 + 7 * i] +
          (resp.ndefMessage[0].payload[14 + 7 * i] << 8) +
          (resp.ndefMessage[0].payload[15 + 7 * i] << 16) +
          (resp.ndefMessage[0].payload[16 + 7 * i] << 24);
        const tag = resp.ndefMessage[0].payload[17 + 7 * i];
        // appendLog(`index: ${index}`);
        // appendLog(`time stamp: ${time_stamp}`);
        // appendLog(`tag: ${tag}`);
        appendLog(`${new Date(time_stamp * 1000)}: ${EVENT_TYPES[tag]}`);
      }
    } else {
      console.warn('get events failed!');
    }
    await NfcManager.cancelTechnologyRequest();
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={{flex: 1, width: '100%'}}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}>
        {false &&
          logs.map((log, index) => (
            <Text key={index} style={styles.logText}>
              {log}
            </Text>
          ))}
        <ButtonView
          title="Red Temperature"
          image={Images.thermometer}
          onPress={getAllMeasurements}
        />
        <ButtonView
          title="Get configuration"
          image={Images.configure}
          onPress={getConfiguration}
        />
        <ButtonView
          title="Reset Tag"
          image={Images.resetTag}
          onPress={setConfiguration}
        />
        <ButtonView
          title="Get event"
          image={Images.GetEvent}
          onPress={getEvents}
        />
        <ButtonView title="Get Id" image={Images.GetId} onPress={getUid} />
        <ButtonView
          title="Get version"
          image={Images.GetVersion}
          onPress={getVersion}
        />
        <ButtonView
          title="Clear logs"
          image={Images.Clearlogs}
          onPress={clearLogs}
        />
        <ButtonView
          title="Share CSV"
          image={Images.csv}
          onPress={() => shareCsvByEmail()}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    marginBottom: 20,
  },
  logText: {
    fontSize: 14,
    color: 'black',
  },
});

export default ConfigScreen;
