Google Cloud Appengine apps for Cypherpunk web frontend:

* `cypherpunk-com` app is main cypherpunk.com site, static html with python runtime
* `cypherpunk-www` app is to redirect www.cypherpunk.com and 100 other typo domains to main cypherpunk.com site, using urlrewrite and java runtime
* `cypherpunk-privacy` app is for API backend at https://cypherpunk.privacy.network/api/* using java runtime to proxy requests to backend NodeJS server
