// the polyfills must be one of the first things imported in node.js.
// The only modules to be imported higher - node modules with es6-promise 3.x or other Promise polyfill dependency
// (rule of thumb: do it if you have zone.js exception that it has been overwritten)
// if you are including modules that modify Promise, such as NewRelic,, you must include them before polyfills
import 'angular2-universal-polyfills';

// Fix Universal Style
import { NodeDomRootRenderer, NodeDomRenderer } from 'angular2-universal/node';
function renderComponentFix(componentProto: any) {
  return new NodeDomRenderer(this, componentProto, this._animationDriver);
}
NodeDomRootRenderer.prototype.renderComponent = renderComponentFix;
// End Fix Universal Style

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

// Angular 2
import { enableProdMode } from '@angular/core';
// Angular 2 Universal
import { createEngine } from 'angular2-express-engine';

// App
import { MainModule } from './app/app.node.module';

// enable prod for faster renders
enableProdMode();

const app = express();
const ROOT = path.join(path.resolve(__dirname, '..'));

// Express View
app.engine('.html', createEngine({
  precompile: true,
  ngModule: MainModule,
  providers: [
    // stateless providers only since it's shared
  ]
}));
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '..', 'dist', 'client'));
app.set('view engine', 'html');

app.use(cookieParser('Angular 2 Universal'));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(ROOT, 'build'), {index: false}));
app.use(express.static(path.join(ROOT, 'dist/client'), {index: false}));


import { serverApi, subs, confirm, login, logout } from './backend/api';
// Our API for demos only
app.get('/data.json', serverApi);
app.get('/api/v0/account/status', subs);
app.post('/api/v0/account/confirm/email', confirm);
app.post('/api/v0/account/authenticate/userpasswd', login);
app.post('/api/v0/account/logout', logout);

function ngApp(req, res) {
  res.render('index', {
    req,
    res,
    preboot: false,
    baseUrl: '/',
    requestUrl: req.originalUrl,
    originUrl: 'http://localhost:3000'
  });
}

// Routes with html5pushstate
// ensure routes match client-side-app
app.get('/', ngApp);
app.get('/home', ngApp);
app.get('/account*', ngApp);
app.get('/account/billing', ngApp);
app.get('/account/upgrade', ngApp);
app.get('/join', ngApp);
app.get('/login', ngApp);
app.get('/reset', ngApp);
app.get('/download', ngApp);
app.get('/confirm', ngApp);
app.get('/whyus', ngApp);
app.get('/howitworks', ngApp);
app.get('/locations', ngApp);
app.get('/privacy', ngApp);
app.get('/aboutus', ngApp);
app.get('/tos', ngApp);
app.get('/bounty', ngApp);
app.get('*', ngApp);

// Server
let server = app.listen(app.get('port'), () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});
