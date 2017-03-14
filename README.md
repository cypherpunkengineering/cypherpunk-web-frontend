# cypherpunk web frontend consists of various Google Cloud apps:

## `cypherpunk-com` Google Appengine - Python runtime
### public cypherpunk.com marketing/customer website
* serves requests for cypherpunk.com
* ng2 (AU, AOT) powered One Page App
* AJAX calls to https://cypherpunk.privacy.network/api/*
* scraper script outputs static html files to fallback gracefully if JS disabled

## `cypherpunk-engineering` Google Appengine - Python runtime
### staging site for `cypherpunk-com`
* auto-deployed by jenkins upon pushes to this repo

## `cypherpunk-www` Google Appengine - Java runtime
### redirect-only app
* serves requests for www.cypherpunk.com and ~100 other typo/alias hostnames
* uses tuckey urlrewrite.xml to redirect all requests to https://cypherpunk.com

## `cypherpunk-privacy` Google Appengine - Java runtime
### backend API app
* serves requests for cypherpunk.privacy.network
* some API resources are handled by java code directly
* some API resources are proxied to backend NodeJS server

## `cypherpunk-download` Google Appengine - Java runtime
### download site
* serves requests for download.cypherpunk.com
* sends files out of a Google Cloud Storage bucket

## `cypherpunk-analytics` Google Firebase
### analytics backend
* record analytics from desktop and mobile apps

## `cypherpunk-dns` Google Cloud DNS
### serves DNS requests for cypherpunk critical infrastructure

## `cypherpunk-network` Google Cloud DNS
### serves DNS requests for cypherpunk non-critical infrastructure

## `cypherpunk-dev` Google Appengine testing
### test app for any random thing

<3
