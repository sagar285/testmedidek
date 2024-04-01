import moment from "moment";

// Get the current date
const currentDate = moment();

// Loop from 0 to 90
for (let i = 0; i < 90; i++) {
  // Add 'i' days to the current date
  const newDate = currentDate.clone().add(i, 'days');

  // Format the date as per your requirement
  const formattedDate = newDate.format('YYYY-MM-DD');

  // Use the formatted date as needed
  console.log(formattedDate);
}
