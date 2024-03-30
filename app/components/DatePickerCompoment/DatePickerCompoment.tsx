import React from 'react';
import DatePicker from 'react-native-date-picker';

interface DatePickerCompomentProps {
  setSelectDate: (date: Date) => void;
  selectedDate: Date;
  isOpen: boolean;
  setOpen: (value: boolean) => void;
}

export default function DatePickerCompoment(props: DatePickerCompomentProps) {
  const {selectedDate, setOpen, isOpen, setSelectDate} = props;
  const minimumDate = new Date();
  minimumDate.setMonth(minimumDate.getMonth() - 12);

  return (
    <DatePicker
      mode="date"
      date={selectedDate}
      onDateChange={setSelectDate}
      modal={true}
      onConfirm={date => {
        setSelectDate(date);
      }}
      minimumDate={minimumDate}
      maximumDate={new Date()}
      theme="dark"
      open={isOpen}
      style={{marginTop: 30}}
      onCancel={() => {
        setOpen(false);
      }}
    />
  );
}
