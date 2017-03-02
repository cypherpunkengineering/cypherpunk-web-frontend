const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const request = require('request');

const baseRoute = 'http://localhost:3000/';
const baseDir = './appengine/target/';
const routes = [
  { url: baseRoute, dirPath: baseDir + 'cypherpunk-public.html' },
  { url: baseRoute + 'pricing', dirPath: baseDir + 'pricing.html' },
  { url: baseRoute + 'download', dirPath: baseDir + 'download.html' },
  { url: baseRoute + 'confirm?accountId=asdf&confirmationToken=asdf', dirPath: baseDir + 'confirm.html' },
  { url: baseRoute + 'login', dirPath: baseDir + 'login.html' },
  { url: baseRoute + 'recover', dirPath: baseDir +'recover.html' },
  { url: baseRoute + 'why-you-need-online-privacy-protection', dirPath: baseDir + 'why-you-need-online-privacy-protection.html' },
  { url: baseRoute + 'features', dirPath: baseDir + 'features.html' },
  { url: baseRoute + 'network', dirPath: baseDir + 'network.html' },
  { url: baseRoute + 'blog', dirPath: baseDir + 'blog.html' },
  { url: baseRoute + 'blog/post/test', dirPath: baseDir + 'blog/post.html' },
  { url: baseRoute + 'privacy-policy', dirPath: baseDir + 'privacy-policy.html' },
  { url: baseRoute + 'aboutus', dirPath: baseDir + 'aboutus.html' },
  { url: baseRoute + 'terms-of-service', dirPath: baseDir + 'terms-of-service.html' },
  { url: baseRoute + '404', dirPath: baseDir + '404.html' },
  { url: baseRoute + 'account', dirPath: baseDir + 'account.html' },
  { url: baseRoute + 'account/upgrade', dirPath: baseDir + 'account/upgrade.html' },
  { url: baseRoute + 'account/billing', dirPath: baseDir + 'account/billing.html' },
  { url: baseRoute + 'account/setup', dirPath: baseDir + 'account/setup.html' },
  { url: baseRoute + 'account/reset', dirPath: baseDir + 'account/reset.html' },
  { url: baseRoute + 'apps', dirPath: baseDir + 'apps.html' },
  { url: baseRoute + 'apps/browser', dirPath: baseDir + 'apps/browser.html' },
  { url: baseRoute + 'apps/mac', dirPath: baseDir + 'apps/mac.html' },
  { url: baseRoute + 'apps/windows', dirPath: baseDir + 'apps/windows.html' },
  { url: baseRoute + 'apps/ios', dirPath: baseDir + 'apps/ios.html' },
  { url: baseRoute + 'apps/android', dirPath: baseDir + 'apps/android.html' },
  { url: baseRoute + 'apps/linux', dirPath: baseDir + 'apps/linux.html' },
  { url: baseRoute + 'apps/routers', dirPath: baseDir + 'apps/routers.html' },
  { url: baseRoute + 'feedback', dirPath: baseDir + 'feedback.html' },
  { url: baseRoute + 'bounty', dirPath: baseDir + 'bounty.html' },
  { url: baseRoute + 'whatsmyip', dirPath: baseDir + 'whatsmyip.html' }
];

return Promise.all(routes.map((routeObject) => {
  return new Promise((resolve, reject) => {
    request(routeObject.url, (error, response, body) => {
      if (error) { return reject(error, response); }
      fs.writeFileSync(routeObject.dirPath, body);
      console.log(routeObject.url, routeObject.dirPath);
      return resolve();
    });
  });
}))
// copy index.#.js file into build dir
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
  let latestFilename, latestTime, latestFile;
  list.forEach((fileName) => {
    let file = path.join('./dist/client', fileName);
    if (file.endsWith('.js')) {
      let time = fs.statSync(file).ctime;
      if (!latestTime || time > latestTime) {
        latestTime = time;
        latestFilename = './appengine/target/' + fileName;
        latestFile = file;
      }
    }
  });

  if (latestFilename && latestFile) {
    fs.writeFileSync(latestFilename, fs.readFileSync(latestFile));
  }
})
// remove all index.*.js files in dist
.then(() => {
  return new Promise((resolve, reject) => {
    rimraf('./dist/client/index.*.js', (err) => {
      if (err) { return reject(err); }
      else { return resolve(); }
    });
  });
})
// shutdown server
.then(() => {
  setTimeout(() => {
    return new Promise((resolve) => {
      request('http://localhost:3000/shutdown', () => {
        // expecting an error
        console.log('Issued command to shutdown server');
        return resolve();
      });
    });
  }, 1000);
})
.catch((err) => { console.log(err); process.exit(1); });
