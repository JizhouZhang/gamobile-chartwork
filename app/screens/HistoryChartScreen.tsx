import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Button,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import BarChartComponent from '../components/BarChartComponent';
import {
  convertTemperatureRecordsToChartData,
  getPasttMonthStartAndEndDate,
  getPasttWeekStartAndEndDate,
} from '../hooks/ChartDataHelper';
import TemperatureDataHelper from '../hooks/TemperatureDataHelper';
import {mockData} from '../constants/mock_data';
import {useTemperatureData} from '../hooks/useTemperatureData';
import CustomModal from '../components/CustomModal';
import moment from 'moment';
import AchievementProgress from '../components/AchievementProgress';
import CustomNavBar from '../components/CustomNavbar';

const HistoryChartScreen = () => {
  const [selectedArrange, setSelectedArrange] = useState('All');
  const [isModalCustom, setIsModalCustom] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const currentDate = new Date();
  const [startDateCustom, setStartDateCustom] = useState(
    currentDate - 7 * 24 * 60 * 60 * 1000,
  );

  const [endDateCustom, setEndDateCustom] = useState(new Date());

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

  const temperatureRecord = TemperatureDataHelper.initTemperatureRecords(
    temperatureData.values,
    startDate,
    endDate,
    deviceInterval,
  );

  useEffect(() => {
    if (selectedArrange === 'All') {
      const chartData = convertTemperatureRecordsToChartData(
        temperatureRecord,
        deviceInterval,
      );
      setGraphData(chartData);
    }
  }, [temperatureData, deviceInterval]);

  if (isScanning) {
    return (
      <View style={styles.container}>
        <Text style={styles.blackText}>Current: {scanningStatus}</Text>
      </View>
    );
  }

  function clickOnAll() {
    setSelectedArrange('All');
    const chartData = convertTemperatureRecordsToChartData(
      temperatureRecord,
      deviceInterval,
    );

    setGraphData(chartData);
  }

  function clickOnMonth() {
    setSelectedArrange('Month');
    const {start, end} = getPasttMonthStartAndEndDate();
    const rangedTemperatureRecord =
      TemperatureDataHelper.generateTemperatureRecordWithRange(
        temperatureRecord,
        start,
        end,
      );
    const chartData = convertTemperatureRecordsToChartData(
      rangedTemperatureRecord,
      deviceInterval,
    );
    console.log({
      temperatureData,
      start: start.toString(),
      end: end.toString(),
      rangedTemperatureRecord,
    });
    setGraphData(chartData);
  }

  function clickOnWeek() {
    setSelectedArrange('Week');
    const {start, end} = getPasttWeekStartAndEndDate();
    const rangedTemperatureRecord =
      TemperatureDataHelper.generateTemperatureRecordWithRange(
        temperatureRecord,
        start,
        end,
      );
    const chartData = convertTemperatureRecordsToChartData(
      rangedTemperatureRecord,
      deviceInterval,
    );
    setGraphData(chartData);
  }

  function clickOnCustom() {
    setSelectedArrange('Custom');
    setIsModalCustom(false);
    const rangedTemperatureRecord =
      TemperatureDataHelper.generateTemperatureRecordWithRange(
        temperatureRecord,
        new Date(startDateCustom),
        endDateCustom,
      );

    const chartData = convertTemperatureRecordsToChartData(
      rangedTemperatureRecord,
      deviceInterval,
    );

    setGraphData(chartData);
  }

  const renderTypeSelected = () => {
    return (
      <View style={styles.selectedView}>
        <TouchableOpacity
          onPress={() => clickOnAll()}
          style={[
            styles.innerView,
            {borderTopLeftRadius: 12, borderBottomLeftRadius: 12},
            selectedArrange == 'All' && {
              backgroundColor: '#4cc652',
            },
          ]}>
          <Text
            style={[
              {color: 'black'},
              selectedArrange == 'All' && {
                color: 'white',
              },
            ]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => clickOnMonth()}
          style={[
            styles.innerView,
            selectedArrange == 'Month' && {
              backgroundColor: '#4cc652',
            },
          ]}>
          <Text
            style={[
              {color: 'black'},
              selectedArrange == 'Month' && {
                color: 'white',
              },
            ]}>
            Past Month
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => clickOnWeek()}
          style={[
            styles.innerView,
            selectedArrange == 'Week' && {
              backgroundColor: '#4cc652',
            },
          ]}>
          <Text
            style={[
              {color: 'black'},
              selectedArrange == 'Week' && {
                color: 'white',
              },
            ]}>
            Past Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsModalCustom(!isModalCustom);
          }}
          style={[
            styles.innerView,
            {
              borderTopRightRadius: 12,
              borderBottomRightRadius: 12,
              borderRightWidth: 0,
            },
            selectedArrange == 'Custom' && {
              backgroundColor: '#4cc652',
            },
          ]}>
          <Text
            style={[
              {color: 'black'},
              selectedArrange == 'Custom' && {
                color: 'white',
              },
            ]}>
            Custom
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const renderGraph = () => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.221,
          shadowRadius: 2.11,
          elevation: 2,
          paddingBottom: 10,
          flex: 0.7,
          marginTop: 20,
          width: '100%',
        }}>
        <Text
          style={{
            margin: 20,
            marginBottom: 0,
            fontSize: 16,
            fontWeight: '700',
            color: 'black',
          }}>
          Graph Data
        </Text>
        <BarChartComponent chartData={graphData} edgeHours={18} />
      </View>
    );
  };

  const renderProgreeCircle = () => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.221,
          shadowRadius: 2.11,
          elevation: 2,
          flex: 0.3,
          width: '100%',
          marginTop: 20,
        }}>
        <Text
          style={{
            margin: 20,
            marginBottom: 0,
            fontSize: 16,
            fontWeight: '700',
            color: 'black',
          }}>
          Your Achievement Score
        </Text>
        <View style={{alignItems: 'center'}}>
          <AchievementProgress chartData={graphData} />
          <Text style={styles.blackText}>
            Total measured {graphData.length} day
            {graphData.length > 1 ? 's' : ''}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: 'white',
        flex: 1,
        paddingHorizontal: 10,
      }}>
      {renderTypeSelected()}
      {renderGraph()}
      {renderProgreeCircle()}

      <TouchableOpacity
        onPress={() => getAllMeasurements()}
        style={{
          height: 54,
          borderRadius: 12,
          backgroundColor: '#4cc652',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.221,
          shadowRadius: 2.11,
          elevation: 2,
          marginTop: 20,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 30,
        }}>
        <Text style={{color: 'white', fontWeight: '500', fontSize: 18}}>
          Scan
        </Text>
      </TouchableOpacity>
      {isModalCustom && (
        <CustomModal
          isModal={isModalCustom}
          setIsModal={setIsModalCustom}
          startDate={new Date(startDateCustom)}
          endDate={new Date(endDateCustom)}
          setStartDate={(value: Date) => setStartDateCustom(value)}
          setEndDate={setEndDateCustom}
          updatebutton={clickOnCustom}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  chartStyle: {
    width: 350, // adjust as needed
  },
  blackText: {
    color: 'black',
    marginVertical: 10,
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
  selectedView: {
    height: 45,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'gray',
    marginTop: 10,
    flexDirection: 'row',
  },
  innerView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.25,
    borderRightWidth: 1,
    borderColor: 'gray',
  },
});

export default HistoryChartScreen;
