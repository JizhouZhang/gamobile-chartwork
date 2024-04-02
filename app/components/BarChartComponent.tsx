import moment from 'moment';
import React from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryLine,
  VictoryTheme,
  VictoryLabel,
} from 'victory-native';

// Interface for the chart data
interface ChartData {
  x: Date;
  y: number;
}

// Interface for the component props
interface BarChartComponentProps {
  chartData?: ChartData[];
  edgeHours: number;
}

const formatDate = (date: Date) => {
  return moment(date).format('MM/DD/YYYY');
};

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  chartData = [],
  edgeHours,
}) => {
  if (!chartData || chartData.length === 0) {
    return (
      <View style={styles.noCharts}>
        <Text>No data available</Text>
      </View>
    );
  }

  const minChartWidth = Dimensions.get('window').width;
  const barWidth = 10;
  const barSpacing = 20;
  const chartWidth = chartData.length * (barWidth + barSpacing);

  return (
    <View style={{flex: 0.75}}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        style={{flexGrow: 1}}
        horizontal>
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={{x: 10}}
          scale={{x: 'time'}}
          width={chartWidth < minChartWidth ? minChartWidth : chartWidth}
          style={{parent: {minWidth: Dimensions.get('window').width}}}>
          <VictoryAxis
            tickFormat={x => formatDate(new Date(x))}
            style={{
              tickLabels: {
                angle: 40,
              },
            }}
            tickLabelComponent={
              <VictoryLabel
                dx={20}
                style={{
                  marginTop: 20,
                  fontSize: 10,
                }}
              />
            }
          />
          <VictoryAxis dependentAxis />
          <VictoryBar
            data={chartData}
            x="x"
            y="y"
            style={{
              data: {
                fill: ({datum}) =>
                  datum.y > edgeHours ? '#ECCCFF' : '#ECCCFF',
              },
            }}
          />
          <VictoryLine
            data={[
              {x: chartData[0].x, y: edgeHours},
              {x: chartData[chartData.length - 1].x, y: edgeHours},
            ]}
            style={{
              data: {stroke: 'blue', strokeWidth: 2},
            }}
          />
        </VictoryChart>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  noCharts: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
});

export default BarChartComponent;
