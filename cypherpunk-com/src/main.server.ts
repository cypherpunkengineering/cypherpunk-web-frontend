import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import { platformServer, renderModuleFactory } from '@angular/platform-server';
import { ServerAppModule } from './app/server-app.module';
import { ngExpressEngine } from '@nguniversal/express-engine';
// Routes
import { routes } from './server.routes';
// Prod Mode for faster renders
import { enableProdMode } from '@angular/core';
enableProdMode();

// Express View
const app = express();
app.engine('html', ngExpressEngine({ bootstrap: ServerAppModule }));
app.set('view engine', 'html');
app.set('views', 'src');
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(morgan('dev'));

// Serve static files
app.use(express.static('./assets', { index: false }));
app.use(express.static('./landing', { index: false }));
app.use('/', express.static('./dist/client', { index: false }));

import {
  subs,
  confirm,
  signin,
  signout,
  locations,
  world,
  identify,
  blog,
  blogPost,
  support,
  supportPost,
  networkStatus,
  signup,
  contactForm } from './backend/api';
import {
  stripePurchase,
  stripeUpgrade,
  stripeCardList,
  stripeDefaultCard,
  stripeCreateCard } from './backend/stripe';
import { amazonPurchase, amazonUpgrade } from './backend/amazon';
// Our API for demos only
app.get('/api/v0/account/status', subs);
app.get('/api/v0/location/list/premium', locations);
app.get('/api/v0/location/world', world);
app.get('/api/v1/blog/posts', blog);
app.get('/api/v1/blog/post/:postId', blogPost);
app.get('/api/v1/support/posts', support);
app.get('/api/v1/support/post/:id', supportPost);
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
app.post('/api/v1/zendesk/request/new', contactForm);

app.get('/', (req, res) => {
  res.render('../dist/client/index.html', {
    req: req,
    res: res
  });
});
routes.forEach(route => {
  app.get('/' + route, (req, res) => {
    res.render('../dist/client/index', {
      req: req,
      res: res
    });
  });
});

app.get('/shutdown', function(req, res) { process.exit(0); });

app.get('*', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  let pojo = { status: 404, message: 'No Content' };
  let json = JSON.stringify(pojo, null, 2);
  res.status(404).send(json);
});

// Server
let server = app.listen(app.get('port'), () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});
