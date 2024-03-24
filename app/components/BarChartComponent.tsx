import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryLine,
  VictoryTheme,
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
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  chartData = [],
  edgeHours,
}) => {
  // Check if chartData is empty or undefined
  if (!chartData || chartData.length === 0) {
    return (
      <View style={styles.noCharts}>
        <Text>No data available</Text>
      </View>
    );
  }

  return (
    <View>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={{x: 10}}
        scale={{x: 'time'}}>
        <VictoryAxis tickFormat={x => formatDate(new Date(x))} />
        <VictoryAxis dependentAxis />
        <VictoryBar
          data={chartData}
          x="x"
          y="y"
          style={{
            data: {fill: ({datum}) => (datum.y > edgeHours ? 'green' : 'red')},
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
