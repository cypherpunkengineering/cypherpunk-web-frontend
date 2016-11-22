#!/bin/bash -x
set -e
source $HOME/.nvm/nvm.sh v7.1.0
nvm install v7.1.0
nvm use v7.1.0
npm install
npm start &
npm run build:prod
sleep 5
npm run scrape
cd appengine
mvn install
mvn appengine:update || true
pkill -P $$
exit 0
