#!/bin/bash -x
set -e
source $HOME/.nvm/nvm.sh
nvm use v6.7.0
npm install
ng build --prod
cd appengine
mvn appengine:update || true
exit 0
