# Cypherpunk Web Frontend built with Angular 2 and Angular Universal


<p align="center">

    <img src="https://cloud.githubusercontent.com/assets/1016365/10639063/138338bc-7806-11e5-8057-d34c75f3cafc.png" alt="Universal Angular 2" height="320"/>

</p>

# Angular 2 Universal Starter [![Universal Angular 2](https://img.shields.io/badge/universal-angular2-brightgreen.svg?style=flat)](https://github.com/angular/universal)
> Server-Side Rendering for Angular 2

A minimal Angular 2 starter for Universal JavaScript using TypeScript 2 and Webpack 2

> If you're looking for the Angular Universal repo go to [**angular/universal**](https://github.com/angular/universal)  

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Universal "Gotchas"

 - To use `templateUrl` or `stylesUrl` you must use **`angular2-template-loader`** in your TS loaders.
    - This is already setup within this starter repo. Look at the webpack.config file [here](https://github.com/angular/universal-starter/blob/master/webpack.config.ts) for details & implementation.
 - **`window`** & **`document`** do not exist on the server - so using them, or any library that uses them (jQuery for example) will not work.
    - If you need to use them, consider limiting them to only your main.client and wrapping them situationally with the imported *isBrowser / isNode* features from Universal.  `import { isBrowser, isNode } from 'angular2-universal';
 - The application runs XHR requests on the server & once again on the Client-side (when the application bootstraps)
    - Use a [UniversalCache](https://github.com/angular/universal-starter/blob/master/src/app/universal-cache.ts) to save certain requests so they aren't re-ran again on the Client.

## Upcoming Universal features

 - SeoServices
 - Universal fixes for Angular Core 2.1.1
 - AoT funcionality is still a *work-in-progress*, but is available as of 2.1.0-rc1

## Installation

* `npm install`

## Dev
* Set DEV_MODE to true in env_vars (DEV_MODE=true)
* `npm start` to clean all generated files, generate all css files (landing and webapp), build this webapp, and launch a nodemon server that serves both the webapp and the landing page at /landing.html
* `npm run watch` to start a watcher on both the webapp sass files and the landing page's sass files

## Production
* `npm run build:prod:ngc` to clean target folder, copy over assets, generate css files, and prepare a distributable bundle for the webapp
* `npm run serve` to start a one time use web server
* `npm run scrape` to scrape all the web pages into the build folder (this will exit the server for you as well)
* (optional) `npm run landing:addon` to add the landing page to the target folder at /landing

## Landing Page
* `npm run landing` will clean all generated files, create the appengine/target dir, generate the css file for the landing page, copy over the css and js files, copy over the html as cypherpunk-public.html, and finally copy over the logo into a generated appengine/target/assets dir.

### Brotli Compression Support

To enable Brotli compression for server response with fallback for gzip.  Install the following packages
```
npm install --save-dev iltorb accepts @types/accepts express-interceptor memory-cache @types/memory-cache
```
and replace the following code from src/server.aot.ts.
```
  import * as compression from 'compression';

  app.use(compression());
```
with
```
import * as mcache from 'memory-cache';
const { gzipSync } = require('zlib');
const accepts = require('accepts');
const { compressSync } = require('iltorb');
const interceptor = require('express-interceptor');

app.use(interceptor((req, res)=>({
  // don't compress responses with this request header
  isInterceptable: () => (!req.headers['x-no-compression']),
  intercept: ( body, send ) => {
    const encodings  = new Set(accepts(req).encodings());
    const bodyBuffer = new Buffer(body);
    // url specific key for response cache
    const key = '__response__' + req.originalUrl || req.url;
    let output = bodyBuffer;
    // check if cache exists
    if (mcache.get(key) === null) {
      // check for encoding support
      if (encodings.has('br')) {
        // brotli
        res.setHeader('Content-Encoding', 'br');
        output = compressSync(bodyBuffer);
        mcache.put(key, {output, encoding: 'br'});
      } else if (encodings.has('gzip')) {
        // gzip
        res.setHeader('Content-Encoding', 'gzip');
        output = gzipSync(bodyBuffer);
        mcache.put(key, {output, encoding: 'gzip'});
      }
    } else {
      const { output, encoding } = mcache.get(key);
      res.setHeader('Content-Encoding', encoding);
      send(output);
    }
    send(output);
  }
})));
```
this will check the support, compress and cache the response.


## Edge case of server compatibility with Promise polyfills

If you have node modules with promise polyfill dependency on server - there is chance to get the following exception:
```
Error: Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten.
```
It occurs because [Zone.js](https://github.com/angular/zone.js/) Promise implementation is not
detected as Promise by some polyfills (e.g. [es6-promise](https://github.com/stefanpenner/es6-promise) before 4.x).

To sort it out, you need such polyfills initialized before zone.js. Zone.js is initialized in 'angular2-universal-polyfills'
import of [server.ts](https://github.com/angular/universal-starter/blob/master/src/server.ts#L4). So import problematic
modules before this line.

### Documentation
[Design Doc](https://docs.google.com/document/d/1q6g9UlmEZDXgrkY88AJZ6MUrUxcnwhBGS0EXbVlYicY)

## [preboot.js](https://github.com/angular/preboot)
> Control server-rendered page and transfer state before client-side web app loads to the client-side-app.
