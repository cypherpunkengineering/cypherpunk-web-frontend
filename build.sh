#!/bin/bash -x
set -e
source $HOME/.nvm/nvm.sh
nvm use v6.7.0
cd appengine
mvn install
mvn appengine:update || true
exit 0
