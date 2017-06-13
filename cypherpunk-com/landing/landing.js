// Coundown timer
var launchDate = new Date('2017-05-15T00:00:00-0500');
var _second = 1000;
var _minute = _second * 60;
var _hour = _minute * 60;
var _day = _hour * 24;
var timer;

var days = document.getElementById('days');
var hours = document.getElementById('hours');
var minutes = document.getElementById('minutes');
var seconds = document.getElementById('seconds');

function showRemaining() {
  var now = new Date();
  var distance = launchDate - now;
  if (distance < 0) {
    clearInterval(timer);
    days.innerHTML = '00';
    hours.innerHTML = '00';
    minutes.innerHTML = '00';
    seconds.innerHTML = '00';
    return;
  }
  var daysMeasured = Math.floor(distance / _day);
  var hoursMeasured = Math.floor((distance % _day) / _hour);
  var minutesMeasured = Math.floor((distance % _hour) / _minute);
  var secondsMeasured = Math.floor((distance % _minute) / _second);

  days.innerHTML = daysMeasured;
  hours.innerHTML = hoursMeasured;
  minutes.innerHTML = minutesMeasured;
  seconds.innerHTML = secondsMeasured;
}

if (days && hours && minutes && seconds) {
  showRemaining();
  timer = setInterval(showRemaining, 1000);
}


// Email subscription
var emailInput = document.getElementById('email');
var emailButton = document.getElementById('subscribe');
if (emailInput && emailButton) {
  emailButton.addEventListener('click', registerEmail);
}

function registerInputEmail(event) {
  if (event.keyCode === 13) { registerEmail(); }
}

function registerEmail() {
  var email = emailInput.value;
  var password = 'test123';
  var xmlHttp = new XMLHttpRequest();

  var url = 'https://api.cypherpunk.com/api/v0/account/register/teaser';
  xmlHttp.open("POST", url, true);

  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState === 4) {
      if (xmlHttp.status === 200 || xmlHttp.status === 202) {
        window.location.href = '/thanks.html';
      }
      else if (xmlHttp.status === 409) {
        setMessage('This email has already been invited');
      }
      else { setMessage('There was an error adding your email'); }
    }
  };

  xmlHttp.setRequestHeader("Content-Type", "application/json");
  xmlHttp.send(JSON.stringify({ email: email, password: password}));
}


// Error Handling
function setMessage(header, text) {
  var messageElement = document.getElementById('message-container');
  var messageTextElement = document.getElementById('message-text');
  var messageHeaderElement = document.getElementById('message-header');

  messageElement.style.display = 'block';
  messageHeaderElement.innerHTML = header;
  if (text) { messageTextElement.innerHTML = text; }
}

var errorClose = document.getElementById('message-close');
if (errorClose) {
  errorClose.addEventListener('click', function() {
    var messageElement = document.getElementById('message-container');
    messageElement.style.display = 'none';
  });
}
