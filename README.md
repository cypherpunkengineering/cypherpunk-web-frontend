cypherpunk web frontend is composed of multiple Google Cloud Appengine apps, each with a specific purpose:

* `cypherpunk-com` is main cypherpunk.com site, static html with python runtime
* `cypherpunk-www` is to redirect www.cypherpunk.com and 100 other typo domains to main cypherpunk.com site, using urlrewrite and java runtime
* `cypherpunk-privacy` is for API backend at https://cypherpunk.privacy.network/api/* using java runtime to proxy requests to backend NodeJS server
* `cypherpunk-download` is to serve files out of a Google Cloud Storage bucket for https://download.cypherpunk.com/

<3
