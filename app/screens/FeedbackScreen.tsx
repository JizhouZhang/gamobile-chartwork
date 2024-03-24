import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';

const FeedbackScreen = () => {
  // Function to handle the email action
  const handleEmail = () => {
    const email = 'support@bracewyse.com'; // Replace with your support email
    const subject = encodeURIComponent('Feedback from BraceWyse User');
    const body = encodeURIComponent('Here is my feedback:\n');

    Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BraceWyse Values Your Feedback</Text>
      <Text style={styles.subtitle}>Help us to improve your experience</Text>
      <View style={styles.content}>
        <Text style={styles.textContent}>
          Your opinions and suggestions are important to us. Please share your
          thoughts about our app, what you like, what could be improved, and any
          features you'd like to see in the future.
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleEmail}>
        <Text style={styles.buttonText}>Write to BraceWyse support</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Light background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333', // Dark font color for better contrast
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#555555', // Slightly lighter font color for the subtitle
  },
  content: {
    marginBottom: 20,
  },
  textContent: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333333', // Dark font color for content
  },
  button: {
    backgroundColor: '#007bff', // Blue button background
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white', // White text on the button for contrast
    fontSize: 16,
  },
});

export default FeedbackScreen;
