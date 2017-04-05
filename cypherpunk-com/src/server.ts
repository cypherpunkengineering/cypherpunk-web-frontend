// the polyfills must be one of the first things imported in node.js.
// The only modules to be imported higher - node modules with es6-promise 3.x or other Promise polyfill dependency
// (rule of thumb: do it if you have zone.js exception that it has been overwritten)
// if you are including modules that modify Promise, such as NewRelic,, you must include them before polyfills
import 'angular2-universal-polyfills';
import 'ts-helpers';
import './__workaround.node'; // temporary until 2.1.1 things are patched in Core

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as compression from 'compression';

// Angular 2
import { enableProdMode } from '@angular/core';
// Angular 2 Universal
import { createEngine } from 'angular2-express-engine';

// App
import { MainModule } from './node.module';

// Routes
import { routes } from './server.routes';

// enable prod for faster renders
enableProdMode();

const app = express();
const ROOT = path.join(path.resolve(__dirname, '..'));

// Express View
app.engine('.html', createEngine({
  ngModule: MainModule,
  providers: [
    // use only if you have shared state between users
    // { provide: 'LRU', useFactory: () => new LRU(10) }

    // stateless providers only since it's shared
  ]
}));
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '..', 'dist', 'client'));
app.set('view engine', 'html');
app.set('json spaces', 2);

app.use(cookieParser('Angular 2 Universal'));
app.use(bodyParser.json());
app.use(compression());
app.use(morgan('dev'));

function cacheControl(req, res, next) {
  // instruct browser to revalidate in 60 seconds
  res.header('Cache-Control', 'max-age=60');
  next();
}

// Serve static files
app.use(express.static(path.join(ROOT, 'assets'), {index: false, redirect: false}));
app.use(express.static(path.join(ROOT, 'landing'), {index: false, redirect: false}));
app.use(cacheControl, express.static(path.join(ROOT, 'dist/client'), {index: false}));


import { subs, confirm, signin, signout, locations, world, identify, blog, blogPost, networkStatus, signup } from './backend/api';
import { stripePurchase, stripeUpgrade, stripeCardList, stripeDefaultCard, stripeCreateCard } from './backend/stripe';
import { amazonPurchase, amazonUpgrade } from './backend/amazon';
// Our API for demos only
app.get('/api/v0/account/status', subs);
app.get('/api/v0/location/list/premium', locations);
app.get('/api/v0/location/world', world);
app.get('/api/v0/blog/posts', blog);
app.get('/api/v0/blog/post/:postId', blogPost);
app.get('/api/v0/network/status', networkStatus);
app.post('/api/v0/account/confirm/email', confirm);
app.post('/api/v0/account/authenticate/userpasswd', signin);
app.post('/api/v0/account/logout', signout);
app.post('/api/v0/account/identify/email', identify);
app.post('/api/v0/account/register/signup', signup);
app.post('/api/v0/payment/amazon/billingAgreement', amazonPurchase);
app.post('/api/v0/account/purchase/stripe', stripePurchase);
app.post('/api/v0/account/upgrade/stripe', stripeUpgrade);
app.get('/api/v0/account/source/list', stripeCardList);
app.post('/api/v0/account/source/default', stripeDefaultCard);
app.post('/api/v0/account/source/add', stripeCreateCard);
app.post('/api/v0/account/purchase/amazon', amazonPurchase);
app.post('/api/v0/account/upgrade/amazon', amazonUpgrade);

function ngApp(req, res) {
  res.render('index', {
    req,
    res,
    // time: true, // use this to determine what part of your app is slow only in development
    preboot: false,
    baseUrl: '/',
    requestUrl: req.originalUrl,
    originUrl: `http://localhost:${ app.get('port') }`
  });
}

/**
 * use universal for specific routes
 */
app.get('/', ngApp);
routes.forEach(route => {
  app.get(`/${route}`, ngApp);
  app.get(`/${route}/*`, ngApp);
});

app.get('/shutdown', function(req, res) { process.exit(0); });

app.get('*', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var pojo = { status: 404, message: 'No Content' };
  var json = JSON.stringify(pojo, null, 2);
  res.status(404).send(json);
});


// Server
let server = app.listen(app.get('port'), () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});