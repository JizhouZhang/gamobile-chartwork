import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HistoryChartScreen from './app/screens/HistoryChartScreen';
import ConfigScreen from './app/screens/ConfigScreen';
import FeedbackScreen from './app/screens/FeedbackScreen';
import {RouteProp} from '@react-navigation/native';
import {Image, Platform, Text, View} from 'react-native';
import Images from './app/theme/Images';

const Tab = createBottomTabNavigator();

type RenderIconProps = {
  focused: boolean;
  title: string;
  image: HTMLImageElement;
};

const renderIcon = ({focused, image, title}: RenderIconProps) => (
  <View style={{alignItems: 'center'}}>
    <Image
      source={image}
      style={[{height: 24, width: 24}, focused && {tintColor: '#4cc652'}]}
    />
    <Text style={[{marginTop: 8, fontSize: 12}, focused && {color: '#4cc652'}]}>
      {title}
    </Text>
  </View>
);

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Wear Logs"
        screenOptions={({route}) => ({
          tabBarIcon: props => renderIcon({...props, route}),
          tabBarActiveTintColor: '#4cc652',
          tabBarInactiveTintColor: 'black',
          tabBarShowLabel: false,
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 20},
          headerStyle: {borderBottomWidth: 0, borderColor: 'white'},
          marginBottom: 10,
          tabBarStyle: {
            height: Platform.OS == 'android' ? 70 : 90,
            backgroundColor: 'white',
          },
        })}>
        <Tab.Screen
          options={({route}) => ({
            tabBarIcon: ({focused}) =>
              renderIcon({focused, image: Images.history, title: 'Wear Logs'}),
          })}
          name="Wear Logs"
          component={HistoryChartScreen}
        />
        <Tab.Screen
          options={({route}) => ({
            tabBarIcon: ({focused}) =>
              renderIcon({
                focused,
                image: Images.settings,
                title: 'Tag Configurations',
              }),
          })}
          name="Tag Configurations"
          component={ConfigScreen}
        />
        <Tab.Screen
          options={({route}) => ({
            tabBarIcon: ({focused}) =>
              renderIcon({focused, image: Images.phone, title: 'Feedback'}),
          })}
          name="Feedback"
          component={FeedbackScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
