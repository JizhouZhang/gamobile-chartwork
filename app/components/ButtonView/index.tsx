import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from './styles';

interface ButtonViewProps {
  title: string;
  image: HTMLImageElement;
  onPress: () => void;
}
export default function ButtonView(props: ButtonViewProps) {
  const {title, image, onPress} = props;

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={styles.container}>
      <Image
        style={{width: 24, height: 24, tintColor: '#4cc652'}}
        source={image}
      />
      <Text style={{marginLeft: 10}}>{title}</Text>
    </TouchableOpacity>
  );
}
