const fs = require('fs');
const path = require('path');
const walk = require('fs-walk');
const cheerio = require('cheerio');

const defaultTitle = 'Cypherpunk Privacy | Online Privacy &amp; Freedom Made Easy';
const defaultDescription = 'Unrestricted internet access and online privacy protection for all your devices. Cypherpunk Privacy is your guardian of online privacy and freedom.';
const defaultImage = 'https://cypherpunk.com/assets/features/masthead@2x.png';

const metaMap = {
  'cypherpunk-public.html': { url: 'https://cypherpunk.com' },
  'android.html': { url: 'https://cypherpunk.com/apps/android' },
  'browser.html': { url: 'https://cypherpunk.com/apps/browser' },
  'ios.html': { url: 'https://cypherpunk.com/apps/ios' },
  'linux.html': { url: 'https://cypherpunk.com/apps/linux' },
  'mac.html': { url: 'https://cypherpunk.com/apps/mac' },
  'routers.html': { url: 'https://cypherpunk.com/apps/routers' },
  'windows.html': { url: 'https://cypherpunk.com/apps/windows' },
  'billing.html': { url: 'https://cypherpunk.com/account/billing' },
  'reset.html': { url: 'https://cypherpunk.com/account/reset' },
  'setup.html': { url: 'https://cypherpunk.com/account/setup' },
  'upgrade.html': { url: 'https://cypherpunk.com/account/upgrade' },
  'features.html': {
    title: 'How Cypherpunk Privacy Protects Your Online Privacy and Freedom',
    description: 'Learn how Cypherpunk Privacy provides unrestricted access to the internet and protects your privacy online.'
  },
  'why-you-need-online-privacy-protection.html': {
    title: 'Why You Need Online Privacy Protection',
    description: 'Cypherpunk Privacy provides unrestricted access to the internet, protects your privacy online and secures public WiFi networks.'
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

  // update title
  let title = defaultTitle;
  if (metaMap[filename] && metaMap[filename].title) { title = metaMap[filename].title; }
  $('title').text(title);
  $('meta[property="og:title"]').attr('content', title);
  $('meta[name="twitter:title"]').attr('value', title);

  // update description
  let description = defaultDescription;
  if (metaMap[filename] && metaMap[filename].description) {
    description = metaMap[filename].description;
  }
  $('meta[name="description"]').attr('content', description);
  $('meta[property="og:description"]').attr('content', description);
  $('meta[name="twitter:description"]').attr('value', description);

  // update url
  let simpleFilename = filename.replace('.html', '');
  let url = 'https://cypherpunk.com/' + simpleFilename;
  if (metaMap[filename] && metaMap[filename].url) { url = metaMap[filename].url; }
  $('meta[property="og:url"]').attr('content', url);
  $('meta[name="twitter:url"]').attr('value', url);

  // update image
  let image = defaultImage;
  if (metaMap[filename] && metaMap[filename].image) { image = metaMap[filename].image; }
  $('meta[property="og:image"]').attr('content', image);
  $('meta[name="twitter:image"]').attr('content', image);

  // rewrite file
  fs.writeFile(filepath, $.html(), function(err) {
    if (err) { console.log(err); }
    else { console.log('Updated: ' + filepath); }
  });
}
