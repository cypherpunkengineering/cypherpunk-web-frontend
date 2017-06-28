import 'zone.js/dist/zone';
import 'reflect-metadata';
import 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/es6/function';
import 'core-js/es6/parse-int';
import 'core-js/es6/parse-float';
import 'core-js/es6/number';
import 'core-js/es6/math';
import 'core-js/es6/string';
import 'core-js/es6/date';
import 'core-js/es6/array';
import 'core-js/es6/regexp';
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/weak-map';
import 'core-js/es6/weak-set';
import 'core-js/es6/typed';
import 'core-js/es6/reflect';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAppModule } from './app/browser-app.module';

import { enableProdMode } from '@angular/core';
enableProdMode();

document.addEventListener('DOMContentLoaded', function main() {
  platformBrowserDynamic().bootstrapModule(BrowserAppModule);
});
