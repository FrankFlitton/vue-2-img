export const getDate = () => {
  var objToday = new Date();
  var day = objToday.getDay();
  var months = [
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
  var curMonth = months[objToday.getMonth()];
  var curYear = objToday.getFullYear();
  var curHour =
    objToday.getHours() > 12
      ? objToday.getHours() - 12
      : objToday.getHours() < 10
      ? "0" + objToday.getHours()
      : objToday.getHours();
  var curMinute =
    objToday.getMinutes() < 10
      ? "0" + objToday.getMinutes()
      : objToday.getMinutes();
  var curSeconds =
    objToday.getSeconds() < 10
      ? "0" + objToday.getSeconds()
      : objToday.getSeconds();
  var today =
    curHour +
    ":" +
    curMinute +
    "." +
    curSeconds +
    "_" +
    day +
    "_" +
    curMonth +
    "_" +
    curYear;

  return today;
};
