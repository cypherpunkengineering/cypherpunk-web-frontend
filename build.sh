#!/bin/bash -x
set -e

# prepare node/npm
source $HOME/.nvm/nvm.sh v7.1.0
nvm install v7.1.0
nvm use v7.1.0

# prepare global deps
npm uninstall -g angular-cli
npm cache clean
npm install -g node-gyp
npm install -g node-pre-gyp
npm install -g angular-cli

# prepare local deps
npm install

# start build
npm start &
npm run build:prod
sleep 5

# start scrape
npm run scrape

# deploy to appengine
cd appengine
mvn install
mvn appengine:update || true

# kill everything
pkill -P $$

# done
exit 0
