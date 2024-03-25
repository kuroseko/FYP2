export const daysLeft = (deadline) => {
  // Check if the deadline is already processed as "Ended"
  if (deadline === "Ended" || deadline === "Conversion Error") {
    return deadline; // Return the string directly without calculation
  }

  try {
    const difference = new Date(deadline).getTime() - Date.now();
    // Ensure the difference is meaningful to calculate
    if (!isNaN(difference)) {
      const remainingDays = difference / (1000 * 3600 * 24);
      return remainingDays.toFixed(0);
    } else {
      console.error("Invalid date provided to daysLeft function:", deadline);
      return "Invalid Date"; // or return "Ended" or any other placeholder you prefer
    }
  } catch (error) {
    console.error("Error calculating days left for deadline:", error);
    return "Error"; // Placeholder for any calculation errors
  }
};
  export const calculateBarPercentage = (goal, raisedAmount) => {
    const percentage = Math.round((raisedAmount * 100) / goal);
  
    return percentage;
  };
  