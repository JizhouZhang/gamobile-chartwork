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
