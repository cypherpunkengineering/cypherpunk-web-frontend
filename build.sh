#!/bin/bash -x
set -e
source $HOME/.nvm/nvm.sh
nvm use v6.7.0
npm start &
npm run build:prod
sleep 5
npm run scrape
cd appengine
mvn install
mvn appengine:update || true
pkill -P $$
exit 0
