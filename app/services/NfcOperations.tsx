// NfcOperations.tsx
import NfcManager, {Ndef, NfcTech} from 'react-native-nfc-manager';

export const startNfcManager = async (): Promise<void> => {
  try {
    await NfcManager.start();
  } catch (ex) {
    console.warn('Error starting NFC Manager:', ex);
  }
};

export const getConfiguration = async (): Promise<boolean> => {
  let success = true;

  try {
    const command = [72, 0];
    await NfcManager.requestTechnology(NfcTech.Ndef);

    const bytes = Ndef.encodeMessage([
      Ndef.record(Ndef.TNF_MIME_MEDIA, Ndef.RTD_TEXT, '0', command),
    ]);
    console.log('encodeMessage:', bytes);

    await NfcManager.ndefHandler.writeNdefMessage(bytes, {
      reconnectAfterWrite: true,
    });
    console.log('writeNdefMessage completed');

    const response = await NfcManager.ndefHandler.getNdefMessage();
    if (response && response.ndefMessage) {
      response.ndefMessage.forEach(record => {
        if (record.payload[0] === 72) {
          console.log('config:', record.payload);
          console.log(
            'result:',
            record.payload[2] +
              (record.payload[3] << 8) +
              (record.payload[4] << 16) +
              (record.payload[5] << 24),
          );

          // Additional response processing logic
          let configTime =
            record.payload[6] +
            (record.payload[7] << 8) +
            (record.payload[8] << 16) +
            (record.payload[9] << 24);
          console.log('configTS:', configTime);
          let configTimeDate = new Date(configTime * 1000);
          console.log('configTime:', configTimeDate);
          console.log(
            'interval:',
            record.payload[10] + (record.payload[11] << 8),
          );
          console.log(
            'startDelay:',
            record.payload[12] +
              (record.payload[13] << 8) +
              (record.payload[14] << 16) +
              (record.payload[15] << 24),
          );
          console.log(
            'runningTime:',
            record.payload[16] +
              (record.payload[17] << 8) +
              (record.payload[18] << 16) +
              (record.payload[19] << 24),
          );
          console.log(
            'validMinimum:',
            record.payload[20] + (record.payload[21] << 8),
          );
          console.log(
            'validMaximum:',
            record.payload[22] + (record.payload[23] << 8),
          );
          console.log(
            'attainedMinimum:',
            record.payload[24] + (record.payload[25] << 8),
          );
          console.log(
            'attainedMaximum:',
            record.payload[26] + (record.payload[27] << 8),
          );
          console.log('count:', record.payload[28] + (record.payload[29] << 8));
          console.log(
            'status:',
            record.payload[30] +
              (record.payload[31] << 8) +
              (record.payload[32] << 16) +
              (record.payload[33] << 24),
          );

          let startTime =
            record.payload[34] +
            (record.payload[35] << 8) +
            (record.payload[36] << 16) +
            (record.payload[37] << 24);
          console.log('startTime:', startTime);
          let startTimeDate = new Date(startTime * 1000);
          console.log('startTimeDate:', startTimeDate);
          console.log(
            'currentTime:',
            record.payload[38] +
              (record.payload[39] << 8) +
              (record.payload[40] << 16) +
              (record.payload[41] << 24),
          );
        }
      });
    }
  } catch (ex) {
    console.warn('NFC Failed:', ex);
    success = false;
  } finally {
    NfcManager.cancelTechnologyRequest();
  }

  return success;
};

// Add any other NFC operations as needed
