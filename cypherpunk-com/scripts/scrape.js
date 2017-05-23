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
  { url: baseRoute + 'download/windows', dirPath: baseDir + 'download/windows.html' },
  { url: baseRoute + 'download/mac', dirPath: baseDir + 'download/mac.html' },
  { url: baseRoute + 'download/linux', dirPath: baseDir + 'download/linux.html' },
  { url: baseRoute + 'download/android', dirPath: baseDir + 'download/android.html' },
  { url: baseRoute + 'download/ios', dirPath: baseDir + 'download/ios.html' },
  { url: baseRoute + 'download/routers', dirPath: baseDir + 'download/routers.html' },
  { url: baseRoute + 'confirm?accountId=asdf&confirmationToken=asdf', dirPath: baseDir + 'confirm.html' },
  { url: baseRoute + 'login', dirPath: baseDir + 'login.html' },
  { url: baseRoute + 'recover', dirPath: baseDir +'recover.html' },
  { url: baseRoute + 'why-use-a-vpn', dirPath: baseDir + 'why-use-a-vpn.html' },
  { url: baseRoute + 'features', dirPath: baseDir + 'features.html' },
  { url: baseRoute + 'network', dirPath: baseDir + 'network.html' },
  { url: baseRoute + 'blog', dirPath: baseDir + 'blog.html' },
  { url: baseRoute + 'blog/post/test', dirPath: baseDir + '../blog-article.html' },
  { url: baseRoute + 'privacy-policy', dirPath: baseDir + 'privacy-policy.html' },
  { url: baseRoute + 'about-us', dirPath: baseDir + 'about-us.html' },
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
  { url: baseRoute + 'whats-my-ip-address', dirPath: baseDir + 'whats-my-ip-address.html' },
  { url: baseRoute + 'signup', dirPath: baseDir + 'signup.html' },
  { url: baseRoute + 'press', dirPath: baseDir + 'press.html' },
  { url: baseRoute + 'reset', dirPath: baseDir + 'reset.html' },
  { url: baseRoute + 'support', dirPath: baseDir + 'support.html' },
  { url: baseRoute + 'support/articles/test', dirPath: baseDir + '../support-article.html' },
  { url: baseRoute + 'support/tutorials/test', dirPath: baseDir + '../support-tutorial.html' },
  { url: baseRoute + 'support/windows', dirPath: baseDir + 'support/windows.html' },
  { url: baseRoute + 'support/macos', dirPath: baseDir + 'support/macos.html' },
  { url: baseRoute + 'support/linux', dirPath: baseDir + 'support/linux.html' },
  { url: baseRoute + 'partial/hostname', dirPath: baseDir + 'partial/hostname.html' },
  { url: baseRoute + 'partial/credentials', dirPath: baseDir + 'partial/credentials.html' }
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
