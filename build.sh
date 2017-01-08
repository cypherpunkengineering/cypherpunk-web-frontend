#!/bin/bash -x
set -e

# build vars
export NODE_VERSION=v6.9.3
export NVM_DIR=$HOME/.nvm

# load nvm depending on OS
case `uname -s` in
	Darwin)
		source "$(brew --prefix nvm)/nvm.sh" ${NODE_VERSION}
		;;
	FreeBSD|Linux)
		source $HOME/.nvm/nvm.sh ${NODE_VERSION}
		;;
esac

# prepare node/npm
nvm install ${NODE_VERSION}
nvm use ${NODE_VERSION}

# prepare local deps
npm install

# start build
npm run build:prod:ngc
node ./scripts/checkServer
npm run serve &
sleep 5

# start scrape
npm run scrape

# deploy to appengine
cd appengine
mvn install
mvn appengine:update || true

# kill server process
pkill -f "node dist/server/index.js"
# done
exit 0
