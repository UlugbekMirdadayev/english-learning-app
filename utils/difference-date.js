import {useEffect, useState} from 'react';
import moment from 'moment';

const DateDifferenceComponent = ({date}) => {
  const [a] = useState(moment(date)); // Start date (a)
  const [b, setB] = useState(moment()); // Current date and time (b)
  const [difference, setDifference] = useState(null); // Difference between b and a

  useEffect(() => {
    // Calculate the difference between b and a when component mounts
    const calculateDifference = () => {
      const duration = moment.duration(b.diff(a)); // Calculate duration between b and a
      setDifference(duration); // Set the difference in state
    };

    calculateDifference(); // Initial calculation

    // Update the difference every second (if needed)
    const interval = setInterval(() => {
      setB(moment()); // Update current date and time (b) every second
      calculateDifference(); // Recalculate the difference
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [a, b]);

  if (!difference) {
    return 'Loading...'; // Render loading state until difference is calculated
  }

  // Extract years, months, days, hours, minutes, and seconds from the difference
  const years = difference.years();
  const months = difference.months();
  const days = difference.days();
  const hours = difference.hours();
  const minutes = difference.minutes();
  const seconds = difference.seconds();

  // Format the difference into the desired string format
  const formattedDifference = `${years ? `${years} years\n` : ''}${
    months ? `${months} months\n` : ''
  }${days ? `${days} days\n` : ''}${hours ? `${hours} hours\n` : ''}${
    minutes ? `${minutes} minutes` : ''
  }${seconds ? `\n${seconds} seconds` : ''}`;

  return formattedDifference; // Render the formatted difference
};

export default DateDifferenceComponent;
