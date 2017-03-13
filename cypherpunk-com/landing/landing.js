// Coundown timer
var launchDate = new Date('February 14, 2017 00:00:00');
var _second = 1000;
var _minute = _second * 60;
var _hour = _minute * 60;
var _day = _hour * 24;
var timer;

function showRemaining() {
  var now = new Date();
  var distance = launchDate - now;
  if (distance < 0) {
    clearInterval(timer);
    document.getElementById('days').innerHTML = '00';
    document.getElementById('hours').innerHTML = '00';
    document.getElementById('minutes').innerHTML = '00';
    document.getElementById('seconds').innerHTML = '00';
    return;
  }
  var days = Math.floor(distance / _day);
  var hours = Math.floor((distance % _day) / _hour);
  var minutes = Math.floor((distance % _hour) / _minute);
  var seconds = Math.floor((distance % _minute) / _second);

  document.getElementById('days').innerHTML = days;
  document.getElementById('hours').innerHTML = hours;
  document.getElementById('minutes').innerHTML = minutes;
  document.getElementById('seconds').innerHTML = seconds;
}

showRemaining();
timer = setInterval(showRemaining, 1000);


// Email subscription
var emailInput = document.getElementById('email');
var emailButton = document.getElementById('subscribe');
emailButton.addEventListener('click', function() {
  var value = emailInput.value;
  console.log(value);
});
