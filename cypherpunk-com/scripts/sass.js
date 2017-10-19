var fs = require('fs');
var path = require('path');
var walk = require('fs-walk');
var postcss = require('postcss');
var sass = require('node-sass');
var autoprefixer = require('autoprefixer');

function PostSasser(plugins) {
  this.plugins = plugins || [ autoprefixer ];
}

PostSasser.prototype.process = function(opts) {
  var plugins = this.plugins;
  var from, to;
  opts = Object.assign({}, opts);
  if (opts.file ? (opts.to || opts.from) : !(opts.to && opts.from)) {
    return Promise.reject(new Error('Bad file specification'));
  }
  from = opts.from || opts.file;
  to = opts.to || from.replace(/\.scss$/, '.css');
  delete opts.from;
  delete opts.to;
  delete opts.file;
  if (!from.endsWith('.scss')) {
    return Promise.reject(new Error('Not a SCSS file'));
  }
  return new Promise((resolve, reject) => {
    sass.render(Object.assign({
      file: from,
      outFile: to,
      precision: 10,
      //sourceMap: true,
      //sourceMapEmbed: true,
      outputStyle: 'compressed',
    }, opts), function(err, result) { if (err) { reject(err); } else { resolve(result); } })
  }).then(result => {
    var file = path.basename(to);
    return postcss(plugins).process(result.css, {
      from: file,
      to: file,
      //map: { inline: false },
    });
  }).then(result => {
    return new Promise((resolve, reject) => {
      fs.writeFile(to, result.css, function(err) { if (err) { reject(err); } else { resolve(); } });
    }).then(() => result);
  });
}

var postsass = function(plugins) {
  return new PostSasser(plugins);
}

module.exports = postsass;



var handleFile = (baseDir, filename) => {
  if (filename.endsWith('.scss')) {
    postsass().process({ file: path.join(baseDir, filename) }).then(result => {
      console.log('wrote css to: ' + result.opts.to);
    });
  }
}

// walk /src/app and sass render all the scss files
walk.filesSync('./src/app', handleFile);
