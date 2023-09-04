const { DateTime } = require('luxon');

const dateString = "Sun Aug 27 2023 20:32:13 GMT-0500 (hora estándar de Perú)";

// Analiza la cadena de fecha utilizando Date.parse
const dateParsed = new Date(dateString);
if (!isNaN(dateParsed)) {
  // Convierte el objeto Date a un objeto DateTime de luxon
  const dateTime = DateTime.fromJSDate(dateParsed);

  // Formatea la fecha y hora según tus necesidades
  const formattedDate = dateTime.toFormat("yyyy-MM-dd HH:mm:ss");
  
  console.log(formattedDate.toString());
} else {
  console.log("Invalid date string");
}