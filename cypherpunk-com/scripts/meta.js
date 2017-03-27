const fs = require('fs');
const path = require('path');
const walk = require('fs-walk');
const cheerio = require('cheerio');

const defaultTitle = 'Cypherpunk Privacy Apps & VPN Service';
const defaultDescription = 'Protect your online privacy and freedom with easy to use apps for every device.   Try it free for 7 days!  24/7/365 customer support.';
const defaultImage = 'https://cypherpunk.com/assets/features/masthead@2x.png';

const metaMap = {
  'cypherpunk-public.html': { url: 'https://cypherpunk.com' },
  'why-you-need-online-privacy-protection.html': {
    title: 'Why You Need Cypherpunk Privacy & VPN Service',
    description: 'Discover how Cypherpunk Privacy protects your online privacy and freedom and secures public Wi-Fi networks. Try it free for  days!'
  },
  'features.html': {
    title: 'Cypherpunk Privacy Features',
    description: 'Learn which VPN and privacy features Cypherpunk uses to keep you safe online, from home and on public-Wi-Fi.'
  },
  'network.html': {
    title: 'Cypherpunk Privacy VPN Network',
    description: 'Choose one of the lightning fast servers on the Cypherpunk Privacy Network to enjoy private, unrestricted internet access.'
  },
  'download.html': {
    title: 'Download Cypherpunk Privacy VPN Apps',
    description: 'Download links for all of Cypherpunk Privacy & VPN Apps for Windows, Macintosh, iOS, Android, Linux, Firefox, Chrome and More.'
  },
  'download:windows.html': {
    url: 'https://cypherpunk.com/download/windows',
    title: 'Download Cypherpunk Privacy VPN Apps For Windows',
    description: 'Download links for all of Cypherpunk Privacy & VPN Apps for Windows, Macintosh, iOS, Android, Linux, Firefox, Chrome and More.'
  },
  'download:mac.html': {
    url: 'https://cypherpunk.com/download/mac',
    title: 'Download Cypherpunk Privacy VPN Apps For MacOS',
    description: 'Download links for all of Cypherpunk Privacy & VPN Apps for Windows, Macintosh, iOS, Android, Linux, Firefox, Chrome and More.'
  },
  'download:linux.html': {
    url: 'https://cypherpunk.com/download/linux',
    title: 'Download Cypherpunk Privacy VPN Apps For Linux',
    description: 'Download links for all of Cypherpunk Privacy & VPN Apps for Windows, Macintosh, iOS, Android, Linux, Firefox, Chrome and More.'
  },
  'download:android.html': {
    url: 'https://cypherpunk.com/download/android',
    title: 'Download Cypherpunk Privacy VPN Apps For Android',
    description: 'Download links for all of Cypherpunk Privacy & VPN Apps for Windows, Macintosh, iOS, Android, Linux, Firefox, Chrome and More.'
  },
  'download:ios.html': {
    url: 'https://cypherpunk.com/download/ios',
    title: 'Download Cypherpunk Privacy VPN Apps For iPhone and iPad',
    description: 'Download links for all of Cypherpunk Privacy & VPN Apps for Windows, Macintosh, iOS, Android, Linux, Firefox, Chrome and More.'
  },
  'download:routers.html': {
    url: 'https://cypherpunk.com/download/routers',
    title: 'Download Cypherpunk Privacy VPN Apps For Routers',
    description: 'Download links for all of Cypherpunk Privacy & VPN Apps for Windows, Macintosh, iOS, Android, Linux, Firefox, Chrome and More.'
  },
  'pricing.html': {
    title: 'Cypherpunk Privacy & VPN Pricing and Order Form',
    description: 'Pricing and order form for Cypherpunk Online Privacy service.'
  },
  'whatsmyip.html': {
    title: 'What\'s My IP Address?',
    description: 'See your current IP address and other information about you that other people can see, plus tips on how to hide that information.'
  },
  'account.html': {
    title: 'My Account with Cypherpunk Privacy',
    description: 'Manage your account on Cypherpunk Privacy, change your email address, reset your password and more.'
  },
  'apps:windows.html': {
    url: 'https://cypherpunk.com/apps/windows',
    title: 'Download Cypherpunk Windows Privacy App',
    description: 'Protect your Windows device with the Cypherpunk Windows Privacy App.'
  },
  'apps:mac.html': {
    url: 'https://cypherpunk.com/apps/mac',
    title: 'Download Cypherpunk Mac Privacy App',
    description: 'Protect your Mac device with the Cypherpunk Macintosh Privacy App.'
  },
  'apps:linux.html': {
    url: 'https://cypherpunk.com/apps/linux',
    title: 'Download Linux Privacy & VPN Apps from Cypherpunk Privacy',
    description: 'Protect your Linux device with the Cypherpunk Linux Privacy App.'
  },
  'apps:browser.html': {
    url: 'https://cypherpunk.com/apps/browser',
    title: 'Download Privacy & VPN Browser Extensions from Cypherpunk Privacy',
    description: 'Protect your from internet browser with Cypherpunk Privacy Browser Extensions'
  },
  'apps:ios.html': {
    url: 'https://cypherpunk.com/apps/ios',
    title: 'Download iOS Privacy & VPN App from Cypherpunk Privacy',
    description: 'Protect your iOS device with the Cypherpunk iOS Privacy App.'
  },
  'apps:android.html': {
    url: 'https://cypherpunk.com/apps/android',
    title: 'Download Android Privacy & VPN App from Cypherpunk Privacy',
    description: 'Protect your Android device with the Cypherpunk Android Privacy App.'
  },
  'apps:routers.html': {
    url: 'https://cypherpunk.com/apps/routers',
    title: 'Download Router Privacy & VPN Apps',
    description: 'Protect your Router with the Cypherpunk Router Privacy App.'
  },
  'aboutus.html': {
    title: 'About Cypherpunk Privacy',
    description: 'Learn about Cypherpunk Privacy and the people behind it.'
  },
  'feedback.html': {
    title: 'Submit Feedback About Cypherpunk Privacy',
    description: 'Help us improve our privacy service by submitting feedback about your experience.'
  },
  'blog.html': {
    title: 'Cypherpunk Online Privacy & Freedom Blog',
    description: 'Online privacy and freedom blog by Cypherpunk Privacy.'
  },
  'privacy-policy.html': {
    title: 'Cypherpunk Privacy Policy',
    description: 'Privacy Policy for Cypherpunk.com, a provider of VPN and privacy apps.'
  },
  'terms-of-service.html': {
    title: 'Cypherpunk Terms of Service',
    description: 'Terms of Service for Cypherpunk privacy service, apps and website.'
  },
  'bounty.html': {
    title: 'Bug Bounty Program by Cypherpunk Privacy',
    description: 'Earn money by ethically disclosing legitimate vulnerabilities to our website and apps.'
  },
  'confirm.html': {
    title: 'Confirmation | Cypherpunk Privacy',
    description: ' '
  },
  'login.html': {
    title: 'Login to Cypherpunk Privacy Account',
    description: 'Login to your account on Cypherpunk.com'
  },
  'recover.html': {
    title: 'Reset your password for Cypherpunk Privacy',
    description: 'Forgot your password to Cypherpunk Privacy? No problem, you can reset it here.'
  },
  '404.html': {
    title: 'Page Not Found | Cypherpunk Privacy',
    description: '404 Error: This page does not exist.'
  },
  'account:upgrade.html': {
    url: 'https://cypherpunk.com/account/upgrade',
    title: 'Upgrade Cypherpunk Account',
    description: ' ',
  },
  'account:billing.html': {
    url: 'https://cypherpunk.com/account/billing',
    title: 'Billing | Cypherpunk Privacy',
    description: ' '
  },
  'account:setup.html': {
    url: 'https://cypherpunk.com/account/setup',
    title: 'Setup Cypherpunk Privacy',
    description: ' '
  },
  'account:reset.html': {
    url: 'https://cypherpunk.com/account/reset',
    title: 'Password Reset for Cypherpunk Privacy',
    description: ' '
  },
  'reset.html': {
    title: 'Password Reset for Cypherpunk Privacy',
    description: ' '
  },
  'signup.html': {
    title: 'Create Account with Cypherpunk Privacy',
    description: 'Create an account with Cypherpunk Privacy'
  },
  'press.html': {
    title: 'Cypherpunk Privacy Press Area',
    description: 'Information about Cypherpunk Privacy and screenshots, images and logos for press inquiries.'
  },
  'blog-article.html': {
    title: '{{__BLOG_TITLE__}}',
    description: '{{__BLOG_CONTENT__}}',
    url: '{{__BLOG_URL__}}',
    image: '{{__BLOG_IMAGE__}}'
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
  let appsSwitch = false;
  let downloadSwitch = false;
  let accountSwitch = false;

  if (baseDir.indexOf('download') > -1) { downloadSwitch = true; }
  else if (baseDir.indexOf('apps') > -1) { appsSwitch = true; }
  else if (baseDir.indexOf('account') > -1) { accountSwitch = true; }

  if (downloadSwitch) { switchFilename = 'download:' + filename; }
  else if (appsSwitch) { switchFilename = 'apps:' + filename; }
  else if (accountSwitch) { switchFilename = 'account:' + filename; }
  else { switchFilename = filename; }


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
