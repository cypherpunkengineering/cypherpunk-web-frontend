// Our API for demos only
import * as request from 'request';

const DEV_MODE = process.env.DEV_MODE || false;
const REAL_MODE = false;

let urlStart = 'http://localhost:8080/';
if (REAL_MODE) { urlStart = 'https://api.cypherpunk.com/'; }

export function stripePurchase(req, res) {

  if (DEV_MODE) {
    let body = req.body;
    let url = urlStart + 'api/v1/account/purchase/stripe';
    return request.post({url: url, body: body, json: true, jar: true }).pipe(res);
  }
  else {
    return res.json({
      secret: '',
      privacy: {
        username: '',
        password: ''
      },
      account: {
        id: '1',
        email: '',
        type: '',
        confirmed: false
      },
      subscription: {
        renewal: '',
        expiration: '0'
      }
    });
  }
}

export function stripeUpgrade(req, res) {
  if (DEV_MODE) {
    let body = req.body;
    let url = urlStart + 'api/v1/account/upgrade/stripe';
    return request.post({url: url, body: body, json: true, jar: true }).pipe(res);
  }
  else {
    return res.json({
      secret: '',
      privacy: {
        username: '',
        password: ''
      },
      account: {
        id: '1',
        email: '',
        type: '',
        confirmed: false
      },
      subscription: {
        renewal: '',
        expiration: '0'
      }
    });
  }
}

export function stripeCardList(req, res) {
  if (DEV_MODE) {
    let url = urlStart + 'api/v1/account/source/list';
    return req.pipe(request({url: url, jar: true })).pipe(res);
  }
  else {
    return res.json({
      default_source: '',
      sources: []
    });
  }
}

export function stripeDefaultCard(req, res) {
  if (DEV_MODE) {
    let body = req.body;
    let url = urlStart + 'api/v1/account/source/default';
    return request.post({url: url, body: body, json: true, jar: true }).pipe(res);
  }
  else {
    return res.json({});
  }
}

export function stripeCreateCard(req, res) {
  if (DEV_MODE) {
    let body = req.body;
    let url = urlStart + 'api/v1/account/source/add';
    return request.post({url: url, body: body, json: true, jar: true }).pipe(res);
  }
  else {
    return res.json({
      id: '',
      brand: 'visa',
      last4: '1234',
      exp_month: 12,
      exp_year: 2020
    });
  }
}
