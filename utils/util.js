function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


//获取当前日期
function getCurrentDate(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd
  }

  if (mm < 10) {
    mm = '0' + mm
  }

  today = yyyy.toString() + mm.toString() + dd.toString();

  return today;
}

//获取当前月份
function getCurrentMonth() {
  var today = new Date();
  var mm = today.getMonth() + 1; //January is 0!

  var currentMonth = mm.toString();

  return currentMonth;
}
//获取当前时分
function getCurrentTime() {
  var today = new Date();
  var hour = today.getHours();
  var minute = today.getMinutes();
  if (hour < 10) {
    hour = '0' + hour
  }
  if (minute < 10) {
    minute = '0' + minute
  }

  var currentTime = hour.toString() + ":" + minute.toString();

  return currentTime;
}
//获取当前日期英文
function getCurrentEnDate() {
  var day_list = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var today = new Date();
  var day = today.getDay();
  var month = today.getMonth(); //January is 0!
  var date = today.getDate().toString();


  var currentEnDate = day_list[day] + ',' + monthList[month] +" "+date;
  return currentEnDate;
}


module.exports = {
  formatTime: formatTime,
  getCurrentDate: getCurrentDate,
  getCurrentMonth: getCurrentMonth,
  getCurrentTime: getCurrentTime,
  getCurrentEnDate: getCurrentEnDate
}


