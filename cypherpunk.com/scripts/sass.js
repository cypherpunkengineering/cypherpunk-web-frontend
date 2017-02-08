var fs = require('fs');
var path = require('path');
var walk = require('fs-walk');
var sass = require('node-sass');

var handleFile = (baseDir, filename) => {
  if (filename.endsWith('.scss')) {
    sassRender(baseDir, filename);
  }
};

var sassRender = (baseDir, filename) => {
  var filepath = path.join(baseDir, filename);
  var opts = { file: filepath, outputStyle: 'compressed' };
  sass.render(opts, function(error, result) {
    if (error) { return console.log(error); }
    else { writeFile(baseDir, filename, result); }
  });
};

var writeFile = (baseDir, filename, result) => {
  var outputFilename = filename.replace('.scss', '.css');
  var outputPath = path.join(baseDir, outputFilename);
  fs.writeFile(outputPath, result.css, function(err) {
    if (err) { console.log(err); }
    console.log('wrote css to: ' + outputPath);
  });
};

// walk /src/app and sass render all the scss files
walk.filesSync('./src/app', handleFile);
walk.filesSync('./build', handleFile);
