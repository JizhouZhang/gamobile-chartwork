import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AchievementProgress from '../components/AchievementProgress';
import BarChartComponent from '../components/BarChartComponent';
import CustomModal from '../components/CustomModal';
import {mockData} from '../constants/mock_data';
import {
  convertTemperatureRecordsToChartData,
  getPasttMonthStartAndEndDate,
  getPasttWeekStartAndEndDate,
} from '../hooks/ChartDataHelper';
import TemperatureDataHelper from '../hooks/TemperatureDataHelper';
import {useTemperatureData} from '../hooks/useTemperatureData';
import {topAlert} from '../utils/chartDataUtils';
import ButtonView from '../components/ButtonView';
import Images from '../theme/Images';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {Popable} from 'react-native-popable';
const HistoryChartScreen = () => {
  const [selectedArrange, setSelectedArrange] = useState('All');
  const [isModalCustom, setIsModalCustom] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const currentDate = new Date();
  const [startDateCustom, setStartDateCustom] = useState(
    currentDate - 7 * 24 * 60 * 60 * 1000,
  );
  const [endDateCustom, setEndDateCustom] = useState(new Date());
  const [isToolTipOpen, setIsToolTipOpen] = useState(() => false);

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
      <View style={styles.graphContainer}>
        <Text style={styles.hoursTxt}>Hours</Text>
        <BarChartComponent chartData={graphData} edgeHours={18} />
      </View>
    );
  };

  const renderProgreeCircle = () => {
    return (
      <View style={styles.processCircleContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center', margin: 20}}>
          <Text style={styles.progressTxt}>Your Achievement Score</Text>
          <Popable
            style={{marginLeft: 5, width: 150}}
            action="hover"
            content="This score represent the average daily hours you wear your brace. A score of 100 means your average daily hours is 18">
            <Image
              style={{width: 24, height: 24, marginLeft: 10}}
              source={Images.tooltip}
            />
          </Popable>
        </View>

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

  const renderBtns = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => getAllMeasurements()}
          style={[styles.scanBtn, {flex: 0.5}]}>
          <Text style={{color: 'white', fontWeight: '500', fontSize: 18}}>
            Scan
          </Text>
        </TouchableOpacity>
        <View style={{flex: 0.5, alignItems: 'center'}}>
          <ButtonView
            title="Share CSV"
            image={Images.csv}
            onPress={() => shareCsvByEmail()}
          />
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
      {renderBtns()}
      {renderGraph()}
      {renderProgreeCircle()}

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

  graphContainer: {
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
  },

  processCircleContainer: {
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
    marginBottom: 30,
  },

  hoursTxt: {
    margin: 20,
    marginBottom: 0,
    fontSize: 16,
    fontWeight: '700',
    color: 'black',
  },

  progressTxt: {
    marginBottom: 0,
    fontSize: 16,
    fontWeight: '700',
    color: 'black',
  },

  scanBtn: {
    height: 60,
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
  },

  blackText: {
    color: 'black',
    marginVertical: 10,
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
