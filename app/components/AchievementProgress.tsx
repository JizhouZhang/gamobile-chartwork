import {View, Text} from 'react-native';
import React, {useEffect, useRef} from 'react';
import CircularProgress from 'react-native-circular-progress-indicator';
import {AchievementScoreCalculation} from '../hooks/ChartDataHelper';

interface AchievementProgressProps {
  chartData: Array<any>;
}

export default function AchievementProgress(props: AchievementProgressProps) {
  const {chartData} = props;
  const processedYValuesArray = chartData.map(item => item.y);
  const resultValue = AchievementScoreCalculation(processedYValuesArray);
  const progressRef = useRef(null);

  return (
    <View style={{flex: 1, marginTop: 20}}>
      <CircularProgress
        value={resultValue ? resultValue : 0}
        key={`circular-progress-${resultValue}`}
        maxValue={Number(100)}
        radius={90}
        ref={progressRef}
        initialValue={0}
        activeStrokeWidth={45}
        inActiveStrokeWidth={45}
        duration={1000}
        clockwise={true}
        progressValueFontSize={20}
        activeStrokeColor={'#4cc652'}
        inActiveStrokeColor={'#DFEEDB'}
        progressFormatter={value => {
          'worklet';
          return `${Math.round(value)}%`;
        }}
      />
    </View>
  );
}
