#!/bin/bash -x
set -e

# prepare node/npm
#source "$(brew --prefix nvm)/nvm.sh" v6.9.1
source $HOME/.nvm/nvm.sh v6.9.1
nvm install v6.9.1
nvm use v6.9.1

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
