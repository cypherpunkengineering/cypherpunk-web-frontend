// Coundown timer
var launchDate = new Date('February 14, 2017 00:00:00');
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
  emailButton.addEventListener('click', function() {
    var email = emailInput.value;
    var password = 'test123';
    var xmlHttp = new XMLHttpRequest();

    var url = 'https://cypherpunk.privacy.network/api/v0/account/register/signup';
    xmlHttp.open("POST", url, true);

    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState === 4) {
        if (xmlHttp.status === 200) { window.location.href = '/landing-thanks.html'; }
        else { console.log(xmlHttp.responseText); }
      }
      else { console.log(xmlHttp); }
    };

    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(JSON.stringify({ email: email, password: password}));
  });
}

// copy share link
function copyTextToClipboard() {
  var input = document.getElementById('cp-share');
  input.select();

  try {
    var successful = document.execCommand('copy');
    if (successful) { window.alert('The link was copied to your clipboard'); }
    else { window.alert('Could not copy this link to your clipboard'); }
  }
  catch (err) {
    window.alert('Was not able to copy to your clipboard');
  }
}

var shareButton = document.getElementById('cp-share-button');
if (shareButton) {
  shareButton.addEventListener('click', function() {
    copyTextToClipboard();
  });
}
