// query param parsing
var qs = (function(a) {
  if (a === "") return {};
  var b = {};
  for (var i = 0; i < a.length; ++i) {
    var p=a[i].split('=', 2);
    if (p.length === 1) { b[p[0]] = ""; }
    else { b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " ")); }
  }
  return b;
})(window.location.search.substr(1).split('&'));


// remove confirmation code from url
history.replaceState({}, document.title, document.location.origin);


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

// confirmation page init code

var accountId = qs.accountId;
var confToken = qs.confirmationToken;

// redirect if no query params
if (!accountId || !confToken) { window.location.href = '/'; }

var xmlHttp = new XMLHttpRequest();
var url = 'https://api.cypherpunk.com/api/v1/account/confirm/email';
xmlHttp.open("POST", url, true);

xmlHttp.onreadystatechange = function() {
  if (xmlHttp.readyState === 4) {

    if (xmlHttp.status === 200 || xmlHttp.status === 202) {
      setMessage('Success!', 'Your invitation has been secured!<br><br>Don\'t forget to invite your friends!');
      setTimeout(function() {
        document.getElementById('message-container').style.display = 'none';
      }, 5000);
    }
    else if (xmlHttp.status === 400) {
      setMessage('Error!', 'Missing Parameters');
    }
    else { setMessage('Error!', 'There was an error confirming your email'); }
  }
};

xmlHttp.setRequestHeader("Content-Type", "application/json");
xmlHttp.send(JSON.stringify({ accountId: accountId, confirmationToken: confToken }));
