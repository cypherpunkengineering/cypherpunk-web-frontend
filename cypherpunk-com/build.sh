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

if [ "$1" = "--target=landing" ];then
	# add versioning tag to html index
	sed -i.bak -e "s/__BUILD_INFO__/${BUILD_INFO}/" landing/landing.html && rm landing/landing.html.bak
	# copy landing page
	npm run landing
else
	# add versioning tag to html index
	sed -i.bak -e "s/__BUILD_INFO__/${BUILD_INFO}/" src/index.ejs && rm src/index.ejs.bak
	# start build
	npm run build:prod:ngc
	node ./scripts/checkServer
	npm run serve &
	sleep 5

	# start scrape
	npm run scrape
	npm run meta
	# npm run landing:addon
fi

# deploy to appengine static
cd appengine/
pip install --upgrade -t lib/ google-api-python-client

if [ "$1" = "--prod" ];then
	cp app-prod.yaml app.yaml
	gcloud config set project cypherpunk-com
else if [ "$1" == "--staging" ];then
	cp app-staging.yaml app.yaml
	gcloud config set project cypherpunk-engineering
else
	cp app-dev.yaml app.yaml
	gcloud config set project cypherpunk-test
fi

echo y | gcloud app deploy

# done done
exit 0
