const fs = require('fs');
const path = require('path');
const request = require('request');

const baseRoute = 'http://localhost:3000/';
const baseDir = './build/';
const routes = [
  { url: baseRoute, dirPath: baseDir + 'cypherpunk-public.html' },
  { url: baseRoute + 'join', dirPath: baseDir + 'join.html' },
  { url: baseRoute + 'download', dirPath: baseDir + 'download.html' },
  { url: baseRoute + 'confirm?accountId=asdf&confirmationToken=asdf', dirPath: baseDir + 'confirm.html' },
  { url: baseRoute + 'login', dirPath: baseDir + 'login.html' },
  { url: baseRoute + 'reset', dirPath: baseDir +'reset.html' },
  { url: baseRoute + 'signup', dirPath: baseDir + 'signup.html' },
  { url: baseRoute + 'whyus', dirPath: baseDir + 'whyus.html' },
  { url: baseRoute + 'howitworks', dirPath: baseDir + 'howitworks.html' },
  { url: baseRoute + 'locations', dirPath: baseDir + 'locations.html' },
  { url: baseRoute + 'privacy', dirPath: baseDir + 'privacy.html' },
  { url: baseRoute + 'aboutus', dirPath: baseDir + 'aboutus.html' },
  { url: baseRoute + 'tos', dirPath: baseDir + 'tos.html' },
  { url: baseRoute + '404', dirPath: baseDir + '404.html' },
  { url: baseRoute + 'user', dirPath: baseDir + 'user/user.html' },
  { url: baseRoute + 'user/upgrade', dirPath: baseDir + 'user/upgrade.html' },
  { url: baseRoute + 'user/billing', dirPath: baseDir + 'user/billing.html' }
];

// get all routes starting with index
routes.forEach((routeObject) => {
  return new Promise((resolve, reject) => {
    request(routeObject.url, (error, response, body) => {
      if (error) { return reject(error, response); }
      fs.writeFileSync(routeObject.dirPath, body);
      console.log(routeObject.url, routeObject.dirPath);
      return resolve();
    });
  });
});

return Promise.all(routes)
.then(() => {
  return new Promise((resolve, reject) => {
    fs.readdir('./dist/client', (err, list) => {
      if (err) { return reject(err); }
      if (list.length === 0) { return reject('No index file found'); }
      else { return resolve(list); }
    });
  });
})
.then((list) => {
  list.forEach((fileName) => {
    let file = path.join('./dist/client', fileName);
    if (file.endsWith('.js')) {
      let targetFile = './build/' + fileName;
      fs.writeFileSync(targetFile, fs.readFileSync(file));
    }
  });
});
