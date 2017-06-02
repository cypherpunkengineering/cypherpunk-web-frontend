# Cypherpunk Privacy's various Google Cloud apps:

## cypherpunk-com: public cypherpunk.com marketing/customer website
### Google Appengine - Python runtime
* serves requests for cypherpunk.com
* ng2 (AU, AOT) powered One Page App
* AJAX calls to https://cypherpunk.privacy.network/api/*
* scraper script outputs static html files to fallback gracefully if JS disabled

## cypherpunk-engineering: staging site for cypherpunk-com app development
### Google Appengine - Python runtime
* auto-deployed by jenkins upon pushes to this repo

## cypherpunk-www: redirect-only app
### Google Appengine - Java runtime
* serves requests for www.cypherpunk.com and ~100 other typo/alias hostnames
* uses tuckey urlrewrite.xml to redirect all requests to https://cypherpunk.com

## cypherpunk-privacy: backend API app
### Google Appengine - Java runtime
* serves requests for cypherpunk.privacy.network
* some API resources are handled by java code directly
* some API resources are proxied to backend NodeJS server

## cypherpunk-download: builds/releases download repo site
### Google Appengine - Java runtime
* serves requests for download.cypherpunk.com
* sends files out of a Google Cloud Storage bucket

## cypherpunk-analytics: analytics backend
### Google Firebase
* record analytics from desktop and mobile apps

## cypherpunk-dns: serves DNS requests for cypherpunk critical infrastructure
### Google Cloud DNS

## cypherpunk-network: serves DNS requests for cypherpunk non-critical infrastructure
### Google Cloud DNS

## cypherpunk-dev: test app for any random thing
### Google Appengine testing

# Things to try if deploy fails
* Change version number of app in appengine-web.xml (java)
* Delete old versions of app on Google Cloud Console (python)
* Delete contents of GCS staging bucket: https://console.cloud.google.com/storage/browser/staging.cypherpunk-engineering.appspot.com/?project=cypherpunk-engineering&organizationId=94359002874

<3
