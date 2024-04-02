import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import DatePickerCompoment from './DatePickerCompoment/DatePickerCompoment';
import moment from 'moment';

interface CustomModalProps {
  isModal: boolean;
  setIsModal: (value: boolean) => void;
  startDate: Date;
  endDate: Date;
  setStartDate: (value: Date) => void;
  setEndDate: (value: Date) => void;
  updatebutton: () => void;
}

export default function CustomModal(props: CustomModalProps) {
  const {
    isModal,
    setIsModal,
    startDate,
    endDate,
    setEndDate,
    setStartDate,
    updatebutton,
  } = props;
  const [isOpenstartDate, setIsOpenstartDate] = useState(false);
  const [isOpenendDate, setIsOpenendDate] = useState(false);

  return (
    <View>
      <Modal
        backdropOpacity={0.5}
        isVisible={isModal}
        onBackdropPress={() => setIsModal(false)}>
        <View style={styles.innerView}>
          <View style={styles.rowDateView}>
            <Text style={styles.dateTxt}>Start Date</Text>
            <TouchableOpacity
              onPress={() => setIsOpenstartDate(true)}
              style={{borderBottomWidth: 1, alignItems: 'center'}}>
              <Text style={styles.selectDateTxt}>
                {moment(startDate).format('MM/DD/YYYY')}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.rowDateView,
              {
                marginTop: 20,
              },
            ]}>
            <Text style={styles.dateTxt}>End Date</Text>
            <TouchableOpacity
              onPress={() => setIsOpenendDate(true)}
              style={{borderBottomWidth: 1, alignItems: 'center'}}>
              <Text style={styles.selectDateTxt}>
                {moment(endDate).format('MM/DD/YYYY')}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              updatebutton();
            }}
            style={styles.btnView}>
            <Text style={styles.btnTxt}>Update</Text>
          </TouchableOpacity>
        </View>
        {isOpenstartDate && (
          <DatePickerCompoment
            setSelectDate={setStartDate}
            selectedDate={new Date(startDate)}
            isOpen={isOpenstartDate}
            setOpen={setIsOpenstartDate}
          />
        )}
        {isOpenendDate && (
          <DatePickerCompoment
            setSelectDate={setEndDate}
            selectedDate={new Date(endDate)}
            isOpen={isOpenendDate}
            setOpen={setIsOpenendDate}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  innerView: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 40,
    height: 200,
  },
  rowDateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  btnView: {
    alignSelf: 'center',
    backgroundColor: '#3a608f',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 30,
  },
  btnTxt: {fontSize: 16, color: 'white'},

  dateTxt: {fontSize: 16, fontWeight: 'bold', color: 'black'},
  selectDateTxt: {fontSize: 14, color: 'black'},
});
