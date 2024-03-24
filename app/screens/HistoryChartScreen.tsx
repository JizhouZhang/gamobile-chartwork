import React from 'react';
import {View, StyleSheet, Button, Text} from 'react-native';

import BarChartComponent from '../components/BarChartComponent';
import {convertTemperatureRecordsToChartData} from '../hooks/ChartDataHelper';
import TemperatureDataHelper from '../hooks/TemperatureDataHelper';
import {mockData} from '../constants/mock_data';
import {useTemperatureData} from '../hooks/useTemperatureData';

const HistoryChartScreen = () => {
  const {
    temperatureData,
    getAllMeasurements,
    isScanning,
    scanningStatus,
    startDate,
    endDate,
    deviceInterval,
  } = useTemperatureData();

  if (temperatureData.values.length === 0) {
    temperatureData.values = mockData;
  }
  if (isScanning) {
    return (
      <View style={styles.container}>
        <Text style={styles.blackText}>Current: {scanningStatus}</Text>
      </View>
    );
  }
  const temperatureRecord = TemperatureDataHelper.generateTemperatureRecords(
    temperatureData.values,
    startDate,
    endDate,
    deviceInterval,
  );
  const chartData = convertTemperatureRecordsToChartData(
    temperatureRecord,
    deviceInterval,
  );

  return (
    <View style={styles.container}>
      <BarChartComponent chartData={chartData} edgeHours={18} />
      {isScanning ? (
        <Text style={styles.blackText}>Scanning {scanningPercentage}%</Text>
      ) : (
        <Button title="Scan" onPress={getAllMeasurements} />
      )}
      <Text style={styles.blackText}>
        Total measured {chartData.length} day{chartData.length > 1 ? 's' : ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  chartStyle: {
    width: 350, // adjust as needed
  },
  blackText: {
    color: 'black',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 20, // Add a top margin to create space above the button
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  // Add or update the modalView style if necessary
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default HistoryChartScreen;
