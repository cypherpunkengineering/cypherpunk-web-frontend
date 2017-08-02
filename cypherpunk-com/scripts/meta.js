const fs = require('fs');
const path = require('path');
const walk = require('fs-walk');
const cheerio = require('cheerio');

const defaultTitle = 'Cypherpunk Privacy Apps & VPN Service';
const defaultDescription = 'Protect your online privacy and freedom with easy to use apps for every device.  Try it free for a limited time only!';
const defaultImage = 'https://cypherpunk.com/assets/landing/landing@2x.png';

const metaMap = {
  'download:windows.html': {
    url: 'https://cypherpunk.com/download/windows',
    title: 'Download Cypherpunk for Windows',
    description: 'Download links for all of Cypherpunk Privacy & VPN Apps for Windows, Macintosh, iOS, Android, Linux, Firefox, Chrome and More.'
  },
  'download:mac.html': {
    url: 'https://cypherpunk.com/download/mac',
    title: 'Download Cypherpunk for your Mac',
    description: 'Download links for all of Cypherpunk Privacy & VPN Apps for Windows, Macintosh, iOS, Android, Linux, Firefox, Chrome and More.'
  },
  'download:macos.html': {
    url: 'https://cypherpunk.com/download/macos',
    title: 'Download Cypherpunk for your Mac',
    description: 'Download links for all of Cypherpunk Privacy & VPN Apps for Windows, Macintosh, iOS, Android, Linux, Firefox, Chrome and More.'
  },
  'download:linux.html': {
    url: 'https://cypherpunk.com/download/linux',
    title: 'Download Cypherpunk for Linux',
    description: 'Download links for all of Cypherpunk Privacy & VPN Apps for Windows, Macintosh, iOS, Android, Linux, Firefox, Chrome and More.'
  },
  'download:android.html': {
    url: 'https://cypherpunk.com/download/android',
    title: 'Download Cypherpunk for Android',
    description: 'Download links for all of Cypherpunk Privacy & VPN Apps for Windows, Macintosh, iOS, Android, Linux, Firefox, Chrome and More.'
  },
  'download:ios.html': {
    url: 'https://cypherpunk.com/download/ios',
    title: 'Download Cypherpunk for iOS',
    description: 'Download links for all of Cypherpunk Privacy & VPN Apps for Windows, Macintosh, iOS, Android, Linux, Firefox, Chrome and More.'
  },
  'download:routers.html': {
    url: 'https://cypherpunk.com/download/routers',
    title: 'Download Cypherpunk for your Router',
    description: 'Download links for all of Cypherpunk Privacy & VPN Apps for Windows, Macintosh, iOS, Android, Linux, Firefox, Chrome and More.'
  },
  // /download/browser
  'account:subscription.html': {
    url: 'https://cypherpunk.com/account/overview',
    title: 'Subscription | Cypherpunk Privacy',
    description: ' '
  },
  'account:billing.html': {
    url: 'https://cypherpunk.com/account/billing',
    title: 'Billing | Cypherpunk Privacy',
    description: ' '
  },
  'account:refer.html': {
    url: 'https://cypherpunk.com/account/refer',
    title: 'Refer | Cypherpunk Privacy',
    description: ' '
  },
  'account:configs.html': {
    url: 'https://cypherpunk.com/account/configs',
    title: 'Configuration | Cypherpunk Privacy',
    description: ' '
  },
  'account:issue.html': {
    url: 'https://cypherpunk.com/account/issue',
    title: 'Report a Bug | Cypherpunk Privacy',
    description: ' '
  }
};

// walk /src/app and sass render all the scss files
walk.walkSync('./appengine', updateMeta);

function updateMeta(baseDir, filename) {
  if (!filename.endsWith('.html')) { return; }

  // read file
  var filepath = path.join(baseDir, filename);
  let file = fs.readFileSync(filepath, 'utf8');
  let $ = cheerio.load(file); // load file into cheerio


  // append extra text to filename based on dir structure
  let switchFilename;
  let downloadSwitch = false;
  let accountSwitch = false;
  if (baseDir.indexOf('download') > -1) { downloadSwitch = true; }
  else if (baseDir.indexOf('account') > -1) { accountSwitch = true; }

  if (downloadSwitch) { switchFilename = 'download:' + filename; }
  else if (accountSwitch) { switchFilename = 'account:' + filename; }
  else { switchFilename = filename; }

  if (!metaMap[switchFilename]) { return; }

  // update title
  let title = defaultTitle;
  if (metaMap[switchFilename] && metaMap[switchFilename].title) {
    title = metaMap[switchFilename].title;
  }
  $('title').text(title);
  $('meta[property="og:title"]').attr('content', title);
  $('meta[name="twitter:title"]').attr('value', title);


  // update description
  let description = defaultDescription;
  if (metaMap[switchFilename] && metaMap[switchFilename].description) {
    description = metaMap[switchFilename].description;
  }
  $('meta[name="description"]').attr('content', description);
  $('meta[property="og:description"]').attr('content', description);
  $('meta[name="twitter:description"]').attr('value', description);


  // update url
  let simpleFilename = filename.replace('.html', '');
  let url = 'https://cypherpunk.com/' + simpleFilename;
  if (metaMap[switchFilename] && metaMap[switchFilename].url) {
    url = metaMap[switchFilename].url;
  }
  $('meta[property="og:url"]').attr('content', url);
  $('meta[name="twitter:url"]').attr('value', url);


  // update image
  let image = defaultImage;
  if (metaMap[switchFilename] && metaMap[switchFilename].image) {
    image = metaMap[switchFilename].image;
  }
  $('meta[property="og:image"]').attr('content', image);
  $('meta[name="twitter:image"]').attr('content', image);


  // rewrite file
  fs.writeFile(filepath, $.html(), function(err) {
    if (err) { console.log(err); }
    else { console.log('Updated: ' + filepath); }
  });
}
