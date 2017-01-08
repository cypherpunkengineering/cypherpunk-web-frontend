let net = require('net');
let server;

let exec = require('child_process').exec;

// kill any server instances
return new Promise((resolve) => {
  exec('pkill -f "node dist/server/index.js"', () => {
    return resolve();
  });
})
// check if anything is running still
.then(() => {
  return new Promise((resolve, reject) => {
    server = net.createServer()
    .once('error', function(err) {
      if (err.code === 'EADDRINUSE') { server.close(); return reject(err); }
      else { server.close(); return reject(err); }
    })
    .once('listening', function() {
      server.once('close', () => { return resolve(); }).close();
    })
    .listen(3000);
  });
})
// process exit on error
.catch((err) => {
  console.log(err);
  process.exit(1);
});
