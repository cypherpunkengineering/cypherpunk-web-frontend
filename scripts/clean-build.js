const rimraf = require('rimraf');

// remove index.*.js files
return new Promise((resolve, reject) => {
  rimraf('./build/index.*.js', (err) => {
    if (err) { return reject(err); }
    else { return resolve(); }
  });
})
// remove all /account/ html files
.then(() => {
  return new Promise((resolve, reject) => {
    rimraf('./build/account/*.html', (err) => {
      if (err) { return reject(err); }
      else { return resolve(); }
    });
  });
})
// remove all html files
.then(() => {
  return new Promise((resolve, reject) => {
    rimraf('./build/*.html', (err) => {
      if (err) { return reject(err); }
      else { return resolve(); }
    });
  });
});
