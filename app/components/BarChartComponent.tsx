import moment from 'moment';
import React, {useEffect, useState} from 'react';
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
  const [selectedBar, setSelectedBar] = useState(null);

  const minChartWidth = Dimensions.get('window').width;
  const barWidth = 10;
  const barSpacing = 20;
  const chartWidth = chartData.length * (barWidth + barSpacing);
  return (
    <View style={{}}>
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
            labels={({datum}) =>
              datum.x === selectedBar ? formatDate(new Date(datum.x)) : ''
            }
            style={{
              data: {
                fill: ({datum}) =>
                  datum.y > edgeHours ? '#4cc652' : '#4cc652',
              },
            }}
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onPressIn: () => {
                    return [
                      {
                        target: 'data',
                        mutation: props => {
                          console.log('Bar clicked:', props.datum);
                          setSelectedBar(props.datum.x);
                          // Perform your action here. For debugging, console.log is a good start.
                        },
                      },
                    ];
                  },
                },
              },
            ]}
          />
          <VictoryLine
            data={[
              {x: chartData[0].x, y: edgeHours},
              {x: chartData[chartData.length - 1].x, y: edgeHours},
            ]}
            style={{
              data: {stroke: '#4cc652', strokeWidth: 2},
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
