import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import Images from '../theme/Images';

const FeedbackScreen = () => {
  // Function to handle the email action
  const handleEmail = () => {
    const email = 'info@bracewyse.com';
    const subject = encodeURIComponent('Feedback from BraceWyse User');
    const body = encodeURIComponent('Here is my feedback:\n');

    Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  return (
    <ScrollView
      style={{backgroundColor: 'white'}}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      <Image
        style={{height: 300, width: 400}}
        source={Images.sendMail}
        resizeMode="cover"
      />
      <View>
        <Text style={styles.title}>BraceWyse Values Your Feedback</Text>
        <Text style={styles.textContent}>
          The BraceWyse sensors were developed in 2021 in the beautiful Pacific
          Northwest. Combined with compactness and efficiency, the BraceWyse can
          be used on TLSOs, AFO, Cranial helmets, and any other applications you
          might be interested in knowing wearing time and pattern. Raw data can
          be exported for further studies. We offer two versions of the
          BraceWyse sensors: BraceWyse and the BraceWyse-mini. The differences
          between the two are physical dimensions and battery choices. Both
          versions provide up to 322 days of data storage (at 15-minute sampling
          interval) and it can be cleared and reused by app settings.
        </Text>
        <Text style={[styles.textContent, {marginTop: 10}]}>
          We are committed to continuous improvements. If you have any
          questions, comments, and suggestions please contact us at
          info@bracewyse.com.
        </Text>
      </View>
      <TouchableOpacity onPress={handleEmail} style={styles.button}>
        <Text style={styles.buttonText}>Write to BraceWyse support</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  textContent: {
    fontSize: 14,
    color: 'black',
    lineHeight: 22,
  },

  button: {
    height: 54,
    borderRadius: 12,
    backgroundColor: '#4cc652',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.221,
    shadowRadius: 2.11,
    elevation: 2,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {color: 'white', fontWeight: '500', fontSize: 18},
});

export default FeedbackScreen;
