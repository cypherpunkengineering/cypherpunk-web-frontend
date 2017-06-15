#!/bin/bash
set -e
umask 022
cd "$( dirname "${BASH_SOURCE[0]}" )"

cp ./appengine-web-development.xml ./src/main/webapp/WEB-INF/appengine-web.xml
mvn appengine:update
rm -f ./src/main/webapp/WEB-INF/appengine-web.xml

exit 0
