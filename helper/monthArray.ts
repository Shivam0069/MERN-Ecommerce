export const createLastSixMonthsArray = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonthIndex = new Date().getMonth(); // Get the current month index (0-11)
  const lastSixMonths = [];

  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonthIndex - i + 12) % 12;
    lastSixMonths.push(months[monthIndex]);
  }

  return lastSixMonths;
};
export const createMonthArray = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonthIndex = new Date().getMonth(); // Get the current month index (0-11)

  const rearrangedMonths = [
    ...months.slice(currentMonthIndex + 1),
    ...months.slice(0, currentMonthIndex + 1),
  ];

  return rearrangedMonths;
};
