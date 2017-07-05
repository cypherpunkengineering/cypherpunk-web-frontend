import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import 'rxjs/Rx';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import { platformServer, renderModuleFactory } from '@angular/platform-server';
import { ServerAppModuleNgFactory } from './ngfactory/app/server-app.module.ngfactory';
import { ngExpressEngine } from '@nguniversal/express-engine';
// Routes
import { routes } from './server.routes';
// Prod Mode for faster render
import { enableProdMode } from '@angular/core';
enableProdMode();

// Express View
const app = express();
app.engine('html', ngExpressEngine({ bootstrap: ServerAppModuleNgFactory }));
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
  changeEmail,
  changePassword,
  locations,
  world,
  identify,
  blog,
  blogPost,
  support,
  supportPost,
  networkStatus,
  signup,
  contactForm,
  pricingPlans,
  billing
} from './backend/api';
import { stripePurchase, stripeUpgrade, stripeCardList, stripeDefaultCard, stripeCreateCard } from './backend/stripe';
import { amazonPurchase, amazonUpgrade } from './backend/amazon';
// Our API for demos only
app.get('/api/v1/account/status', subs);
app.get('/api/v1/location/list/premium', locations);
app.get('/api/v1/location/world', world);
app.get('/api/v1/blog/posts', blog);
app.get('/api/v1/blog/post/:postId', blogPost);
app.get('/api/v1/support/posts', support);
app.get('/api/v1/support/post/:id', supportPost);
app.get('/api/v1/network/status', networkStatus);
app.get('/api/v1/account/source/list', stripeCardList);
app.get('/api/v1/pricing/plans/:referralCode', pricingPlans);
app.get('/api/v1/pricing/plans', pricingPlans);
app.get('/api/v1/billing/receipts', billing);
app.post('/api/v1/account/confirm/email', confirm);
app.post('/api/v1/account/authenticate/userpasswd', signin);
app.post('/api/v1/account/logout', signout);
app.post('/api/v1/account/identify/email', identify);
app.post('/api/v1/account/register/signup', signup);
app.post('/api/v1/account/purchase/stripe', stripePurchase);
app.post('/api/v1/account/upgrade/stripe', stripeUpgrade);
app.post('/api/v1/account/source/default', stripeDefaultCard);
app.post('/api/v1/account/source/add', stripeCreateCard);
app.post('/api/v1/account/purchase/amazon', amazonPurchase);
app.post('/api/v1/account/upgrade/amazon', amazonUpgrade);
app.post('/api/v1/zendesk/request/new', contactForm);
app.post('/api/v1/account/change/email', changeEmail);
app.post('/api/v1/account/change/password', changePassword);

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
