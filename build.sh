#!/bin/sh
npm install
ng build --prod
cd appengine
mvn appengine:update
