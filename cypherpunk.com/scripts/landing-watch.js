var fs = require('fs');
var sass = require('node-sass');
var chokidar = require('chokidar');

var checkFile = (filepath) => {
  if (filepath.endsWith('scss')) { return sassRender(filepath); }
  if (filepath.endsWith('html')) { return copyFile(filepath); }
  if (filepath.endsWith('js')) { return copyFile(filepath); }
};

var sassRender = (filepath) => {
  var opts = { file: filepath, outputStyle: 'compressed' };
  sass.render(opts, function(error, result) {
    if (error) { return console.log(error); }
    else { writeFile(filepath, result, true); }
  });
};

var writeFile = (filepath, result) => {
  filepath = filepath.replace('.scss', '.css');
  fs.writeFile(filepath, result.css, function(err) {
    if (err) { console.log(err); }
    else { console.log('Updated: ' + filepath); }
  });
};

var copyFile = (filepath) => {
  let output = filepath.replace('landing/', 'build/');
  fs.createReadStream(filepath).pipe(fs.createWriteStream(output));
};

var watcher = chokidar.watch('landing/**/*', {
  ignoreInitial: true
});

watcher.on('add', (path) => {
  checkFile(path);
});

watcher.on('change', (path) => {
  checkFile(path);
});

watcher.on('ready', () => {
  console.log('Watching /landing dir...');
});
