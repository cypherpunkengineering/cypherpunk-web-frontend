const request = require('request');
const fs = require('fs');

const baseRoute = 'http://localhost:3000/';
const baseDir = './build/';
const routes = [
  { url: baseRoute, dirPath: baseDir + 'cypherpunk-public.html' },
  { url: baseRoute + 'join', dirPath: baseDir + 'join.html' },
  { url: baseRoute + 'download', dirPath: baseDir + 'download.html' },
  { url: baseRoute + 'confirmation', dirPath: baseDir + 'confirmation.html' },
  { url: baseRoute + 'login', dirPath: baseDir + 'login.html' },
  { url: baseRoute + 'reset', dirPath: baseDir +'reset.html' },
  { url: baseRoute + 'signup', dirPath: baseDir + 'signup.html' },
  // { url: baseRoute + 'user', dirPath: baseDir + 'user/user.html' },
  // { url: baseRoute + 'user/upgrade', dirPath: baseDir + 'user/upgrade.html' },
  // { url: baseRoute + 'user/billing', dirPath: baseDir + 'user/billing.html' }
];

// get all routes starting with index
routes.forEach(function(routeObject) {
  return new Promise(function(resolve, reject) {
    request(routeObject.url, function(error, response, body) {
      if (error) { return reject(error, response); }
      fs.writeFileSync(routeObject.dirPath, body);
      console.log(routeObject.url, routeObject.dirPath);
      return resolve();
    });
  });
});

return Promise.all(routes)
.then(function() {
  let targetFile = './build/index.js';
  let sourceFile = './dist/client/index.js';
  fs.writeFileSync(targetFile, fs.readFileSync(sourceFile));
});
