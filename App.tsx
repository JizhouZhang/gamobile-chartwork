import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HistoryChartScreen from './app/screens/HistoryChartScreen';
import ConfigScreen from './app/screens/ConfigScreen';
import FeedbackScreen from './app/screens/FeedbackScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {RouteProp} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

type RenderIconProps = {
  focused: boolean;
  color: string;
  size: number;
  route: RouteProp<Record<string, object | undefined>, string>;
};

const renderIcon = ({focused, color, size, route}: RenderIconProps) => {
  let iconName: string;

  if (route.name === 'Wear Logs') {
    iconName = 'history';
  } else if (route.name === 'Tag Configurations') {
    iconName = 'settings';
  } else if (route.name === 'Feedback') {
    iconName = 'phone';
  } else {
    iconName = 'default-icon-name'; // Provide a default icon name
  }

  return <Icon name={iconName} size={size} color={color} />;
};

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Wear Logs"
        screenOptions={({route}) => ({
          tabBarIcon: props => renderIcon({...props, route}),
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen name="Wear Logs" component={HistoryChartScreen} />
        <Tab.Screen name="Tag Configurations" component={ConfigScreen} />
        <Tab.Screen name="Feedback" component={FeedbackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
