import Toast from 'react-native-toast-message';

// Utility function to prepare data for the Contribution Graph
export const prepareContributionData = (data, thresholds) => {
  // Logic to filter and prepare data for the past 3 months
  // considering the varying monthly thresholds
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  return data
    .filter(d => new Date(d.date) >= threeMonthsAgo)
    .map(d => {
      const month = new Date(d.date).getMonth();
      const threshold = thresholds[month];
      const tempCelsius = d.value - 180;
      return {
        date: d.date,
        count: tempCelsius > threshold ? 1 : 0,
      };
    });
};

export const topAlert = (message, alertType = 'success') => {
  Toast.show({
    type: alertType,
    text1: 'Alert!',
    text2: message,
    duration: 5000,
    text1Style: {
      fontSize: 15,
      color: 'black',
    },
  });
};
