var fs = require('fs');
var sass = require('node-sass');
var chokidar = require('chokidar');

var sassRender = (filepath) => {
  if (!filepath.endsWith('scss')) { return; }
  var opts = { file: filepath, outputStyle: 'compressed' };
  sass.render(opts, function(error, result) {
    if (error) { return console.log(error); }
    else { writeFile(filepath, result); }
  });
};

var writeFile = (filepath, result) => {
  filepath = filepath.replace('.scss', '.css');
  fs.writeFile(filepath, result.css, function(err) {
    if (err) { console.log(err); }
    else { console.log('Updated: ' + filepath); }
  });
};

var watcher = chokidar.watch('src/app/**/*', {
  ignored: ['**/*.ts', '**/*.html'],
  ignoreInitial: true
});

watcher.on('add', (path) => {
  sassRender(path);
});

watcher.on('change', (path) => {
  sassRender(path);
});

watcher.on('ready', () => {
  console.log('Watching src/app dir...');
});
