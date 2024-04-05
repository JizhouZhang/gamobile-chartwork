import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import moment from 'moment';
import styles from './styles';
import Images from '../../theme/Images';

interface CustomModalProps {
  isModal: boolean;
  setIsModal: (value: boolean) => void;
}

export default function NFCPromptModal(props: CustomModalProps) {
  const {isModal, setIsModal} = props;

  return (
    <View>
      <Modal
        backdropOpacity={0.5}
        isVisible={isModal}
        style={{
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          marginTop: 120,
        }}>
        <View style={styles.innerView}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>NFC Prompt</Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '400',
              textAlign: 'center',
              marginTop: 30,
            }}>
            Please move your phone close to the tag.
          </Text>

          <TouchableOpacity
            style={styles.crossBtn}
            onPress={() => setIsModal(false)}>
            <Image style={{height: 14, width: 14}} source={Images.close} />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
