var fs = require('fs');
var postsass = require('./sass');
var chokidar = require('chokidar');

var sassRender = (filepath) => {
  if (!filepath.endsWith('scss')) { return; }
  postsass().process({ file: filepath }).then(result => {
    console.log('wrote css to: ' + result.opts.to);
  }, err => {
    console.error(err);
  });
};

var watcher = chokidar.watch('landing/**/*', {
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
  console.log('Watching /landing dir...');
});
