// @flow
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  innerView: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 40,
    height: 230,
    alignItems: 'center',
  },
  rowDateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  btnView: {
    alignSelf: 'center',
    backgroundColor: '#4cc652',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 30,
    flex: 0.5,
  },
  btnTxt: {fontSize: 16, fontWeight: '700', color: 'white'},

  selectDateTxt: {fontSize: 14, color: 'black'},
  dropdown: {
    height: 50,
    borderColor: '#4cc652',

    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    flex: 0.33,
    marginRight: 5,
  },
});
