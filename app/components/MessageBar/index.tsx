import React from 'react';
import Toast from 'react-native-toast-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {View} from 'react-native';

export default function MessageBar() {
  const {top} = useSafeAreaInsets();
  return (
    <Toast
      topOffset={top}
      text2Style={{
        fontSize: 12,
        color: 'black',
      }}
    />
  );
}
