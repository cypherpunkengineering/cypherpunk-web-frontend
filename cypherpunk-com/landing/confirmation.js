// query param parsing
var qs = (function(a) {
  if (a == "") return {};
  var b = {};
  for (var i = 0; i < a.length; ++i) {
    var p=a[i].split('=', 2);
    if (p.length == 1) { b[p[0]] = ""; }
    else { b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " ")); }
  }
  return b;
})(window.location.search.substr(1).split('&'));


// remove confirmation code from url
// history.replaceState({}, document.title, document.location.origin);


// Error Handling
function setInfo(errorText) {
  var errorElement = document.getElementById('info-container');
  var errorTextElement = document.getElementById('info-text');

  errorElement.style.display = 'block';
  errorTextElement.innerHTML = errorText;
}

function setError(errorText) {
  var errorElement = document.getElementById('error-container');
  var errorTextElement = document.getElementById('error-text');

  errorElement.style.display = 'block';
  errorTextElement.innerHTML = errorText;
}

var errorClose = document.getElementById('error-close');
if (errorClose) {
  errorClose.addEventListener('click', function() {
    var errorElement = document.getElementById('error-container');
    errorElement.style.display = 'none';
  });
}

var errorClose = document.getElementById('info-close');
if (errorClose) {
  errorClose.addEventListener('click', function() {
    var errorElement = document.getElementById('info-container');
    errorElement.style.display = 'none';
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


// confirmation page init code

var accountId = qs['accountId'];
var confToken = qs['confirmationToken'];

// redirect if no query params
// if (!accountId || !confToken) { window.location.href = '/'; }

var xmlHttp = new XMLHttpRequest();
var url = 'https://cypherpunk.privacy.network/api/v0/account/confirm/email';
xmlHttp.open("POST", url, true);

xmlHttp.onreadystatechange = function() {
  if (xmlHttp.readyState === 4) {
    if (xmlHttp.status === 200 || xmlHttp.status === 202) {
      setInfo('Your Email is confirmed!');
    }
    else if (xmlHttp.status === 400) {
      setError('Missing Parameters');
    }
    else { setError('There was an error confirming your email'); }
  }
};

xmlHttp.setRequestHeader("Content-Type", "application/json");
xmlHttp.send(JSON.stringify({ accountId: accountId, confirmationToken: confToken }));


// Coundown timer
var launchDate = new Date('2017-05-17T00:00:00Z');
var _hour = 1000 * 60 * 60;
var _day = _hour * 24;

var days = document.getElementById('days');
var hours = document.getElementById('hours');

var distance = launchDate - new Date();
if (distance < 0) {
  clearInterval(timer);
  days.innerHTML = '0';
  hours.innerHTML = '0';
}
var daysMeasured = Math.floor(distance / (1000 * 60 * 60 * 24));
var hoursMeasured = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

days.innerHTML = daysMeasured;
hours.innerHTML = hoursMeasured;


// share with friends

var inviteButton = document.getElementById('invite');
if (inviteButton) {
  inviteButton.addEventListener('click', function() {
    inviteOthers();
  });
}

function inviteOthers() {
  var name = document.getElementById('invite-name').value; // (optional)
  var emails = document.getElementById('invite-emails').value.split(',');

  // regex a-z
  name = name.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
  // limit to 20 chars for name
  name = name.substring(0, 20);

  emails.forEach(function(email) {
    var xmlHttp = new XMLHttpRequest();
    var url = 'https://cypherpunk.privacy.network/api/v0/account/register/signup';
    xmlHttp.open("POST", url, true);

    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState === 4) {
        if (xmlHttp.status === 200 || xmlHttp.status === 202) {
          setInfo('Your Email is confirmed!');
        }
        else if (xmlHttp.status === 400) {
          setError('Missing Parameters');
        }
        else if (xmlHttp.status === 409) {
          // setError('Email already exists');
          console.log(email + ' already exits');
        }
        else { setError('There was an error confirming your email'); }
      }
    };

    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(JSON.stringify({ name: name, email: email, password: 'test123' }));
  });
}
