// Our API for demos only
import * as request from 'request';

const DEV_MODE = process.env.DEV_MODE || false;

export function stripePurchase(req, res) {

  if (DEV_MODE) {
    let body = req.body;
    let url = 'http://localhost:8080/api/v0/subscription/purchase';
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
    let url = 'http://localhost:8080/api/v0/account/upgrade/stripe';
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
    let url = 'http://localhost:8080/api/v0/account/source/list';
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
    let url = 'http://localhost:8080/api/v0/account/source/default';
    return request.post({url: url, body: body, json: true, jar: true }).pipe(res);
  }
  else {
    return res.json({});
  }
}

export function stripeCreateCard(req, res) {
  if (DEV_MODE) {
    let body = req.body;
    let url = 'http://localhost:8080/api/v0/account/source/add';
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
