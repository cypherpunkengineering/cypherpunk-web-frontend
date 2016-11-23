#!/bin/bash -x
set -e

# build vars
NODE_VERSION=v6.9.1

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
