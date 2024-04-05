import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import moment from 'moment';
import styles from './styles';

interface CustomModalProps {
  isModal: boolean;
  setIsModal: (value: boolean) => void;
  deleteData: () => void;
  title: string;
}

export default function ConfirmModal(props: CustomModalProps) {
  const {isModal, setIsModal, deleteData, title} = props;

  return (
    <View>
      <Modal
        backdropOpacity={0.5}
        isVisible={isModal}
        onBackdropPress={() => setIsModal(false)}>
        <View style={styles.innerView}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Confirmation</Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '400',
              textAlign: 'center',
              marginTop: 10,
            }}>
            {title}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setIsModal(false);
              }}
              style={[
                styles.btnView,
                {
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: '#4cc652',
                  marginRight: 10,
                },
              ]}>
              <Text style={[styles.btnTxt, {color: '#4cc652'}]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                deleteData();
              }}
              style={styles.btnView}>
              <Text style={styles.btnTxt}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
