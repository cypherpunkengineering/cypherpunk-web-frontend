var fs = require('fs');
var path = require('path');
var walk = require('fs-walk');
var postsass = require('./sass');

var handleFile = (baseDir, filename) => {
  if (filename.endsWith('.scss')) {
    postsass().process({ file: path.join(baseDir, filename) }).then(result => {
      console.log('wrote css to: ' + result.opts.to);
    }, err => {
      console.error(err);
    });
  }
};

// walk /src/app and sass render all the scss files
walk.filesSync('./landing', handleFile);
