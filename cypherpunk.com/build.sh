#!/bin/bash -x
set -e

# build vars
export NODE_VERSION=v6.9.4
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

# debugging tools
GIT_HASH="$(git describe --always --match=nosuchtagpattern --dirty=-p)"
[ -z "${BUILD_NUMBER}" ] && BUILD_NUMBER="manually"
BUILD_INFO="Deployed ${BUILD_NUMBER} on $(date) from revision ${GIT_HASH}"
echo $BUILD_INFO
sed -i '' -e "s/__BUILD_INFO__/${BUILD_INFO}/" src/index.ejs

# start build
npm run build:prod:ngc
node ./scripts/checkServer
npm run serve &
sleep 5

# start scrape
npm run scrape

# deploy to appengine static
cd appengine/
gcloud config set project cypherpunk-engineering
echo y | gcloud app deploy

# done
exit 0
