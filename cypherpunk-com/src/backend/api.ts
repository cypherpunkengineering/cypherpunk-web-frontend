// Our API for demos only
import * as request from 'request';

const DEV_MODE = process.env.DEV_MODE || false;
const REAL_MODE = false;

let urlStart = 'http://localhost:8080/';
if (REAL_MODE) { urlStart = 'https://api.cypherpunk.com/'; }

export function subs(req, res) {
  if (DEV_MODE) {
    let url = urlStart + 'api/v1/account/status';
    return req.pipe(request({url: url, jar: true})).pipe(res);
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

export function identify(req, res) {
  if (DEV_MODE) {
    let body = req.body;
    let url =  urlStart + 'api/v1/account/identify/email';
    return request.post({url: url, body: body, json: true, jar: true }).pipe(res);
  }
  else { return res.sendStatus(401); }
}

export function signup(req, res) {
  if (DEV_MODE) {
    let body = req.body;
    let url = urlStart + 'api/v1/account/register/signup';
    return request.post({url: url, body: body, json: true, jar: true }).pipe(res);
  }
  else {
    return res.json({
      secret: 'abcd',
      privacy: { username: '', password: '' },
      account: { id: 'id', email: '', confirmed: true, type: '' },
      subscription: { renewal: 'forever', expiration: '0' }
    });
  }
}

export function confirm(req, res) {
  if (DEV_MODE) {
    let body = req.body;
    let url = urlStart + 'api/v1/account/confirm/email';
    return request.post({url: url, body: body, json: true, jar: true }).pipe(res);
  }
  else {
    return res.json({
      valid: true,
      account: { email: '' },
      secret: ''
    });
  }
}

export function confirmChange(req, res) {
  if (DEV_MODE) {
    let body = req.body;
    let url = urlStart + 'api/v1/account/confirm/emailChange';
    return request.post({url: url, body: body, json: true, jar: true }).pipe(res);
  }
  else {
    return res.json({
      valid: true,
      account: { email: '' },
      secret: ''
    });
  }
}

export function signin(req, res) {
  if (DEV_MODE) {
    let body = req.body;
    let url = urlStart + 'api/v1/account/authenticate/userpasswd';
    return request.post({url: url, body: body, json: true, jar: true }).pipe(res);
  }
  else {
    return res.json({
      secret: 'abcd',
      privacy: { username: '', password: '' },
      account: { id: 'id', email: '', confirmed: true, type: '' },
      subscription: { renewal: 'forever', expiration: '0' }
    });
  }
}

export function signout(req, res) {
  if (DEV_MODE) {
    let body = req.body;
    let url = urlStart + 'api/v1/account/logout';
    return request.post({url: url, body: body, json: true, jar: true }).pipe(res);
  }
  else {
    return res.json({});
  }
}

export function changeEmail(req, res) {
  if (DEV_MODE) {
    console.log('change email');
    let body = req.body;
    let url = urlStart + 'api/v1/account/change/email';
    return request.post({url: url, body: body, json: true, jar: true }).pipe(res);
  }
  else {
    return res.json({});
  }
}

export function changePassword(req, res) {
  if (DEV_MODE) {
    let body = req.body;
    let url = urlStart + 'api/v1/account/change/password';
    return request.post({url: url, body: body, json: true, jar: true }).pipe(res);
  }
  else {
    return res.json({});
  }
}

export function unsubscribe(req, res) {
  if (DEV_MODE) {
    let path = req.url.substring(1);
    let url = urlStart + path;
    return request.get({url: url, json: true, jar: true }).pipe(res);
  }
  else {
    return res.json({ success: 'ok' });
  }
}


export function networkStatus(req, res) {
  if (DEV_MODE) { return request(urlStart + 'api/v1/network/status').pipe(res); }
  else { return res.json({ ip: '127.0.0.1', country: 'ZZ'}); }
}

export function blog(req, res) {
  if (DEV_MODE) {
    return request(urlStart + 'api/v1/blog/posts', (err, resp, body) => {
      let retval = JSON.parse(body);
      return res.json(retval);
    });
  }
  else { res.json({}); }
}

export function blogPost(req, res) {
  let postId = req.params.postId;
  if (postId === 'test') {
    return res.json({
      id: 'test',
      title: '{{__BLOG_TITLE__}}',
      content: '{{__BLOG_CONTENT__}}',
      published: '{{__BLOG_DATE__}}',
      images: [ { url: '{{__BLOG_IMAGE__}}' } ]
    });
  }
  else if (DEV_MODE) {
    return request(urlStart + 'api/v1/blog/post/' + postId, (err, resp, body) => {
      let retval = JSON.parse(body);
      return res.json(retval);
    });
  }
  else { res.json({}); }
}

export function support(req, res) {
  if (DEV_MODE) {
    return request(urlStart + 'api/v1/support/posts', (err, resp, body) => {
      try { return res.json(JSON.parse(body)); }
      catch (e) { return res.send(500); }
    });
  }
  else { res.json({}); }
}

export function supportPost(req, res) {
  let id = req.params.id;
  if (id === 'test') {
    return res.json({
      id: 'test',
      title: '{{__SUPPORT_TITLE__}}',
      content: '{{__SUPPORT_CONTENT__}}',
      published: '{{__SUPPORT_DATE__}}',
      images: [ { url: '{{__SUPPORT_IMAGE__}}' } ]
    });
  }
  else if (DEV_MODE) {
    return request(urlStart + 'api/v1/support/post/' + id, (err, resp, body) => {
      try { return res.json(JSON.parse(body)); }
      catch (e) { return res.send(404); }
    });
  }
  else { res.json({}); }
}

export function contactForm(req, res) {
  if (DEV_MODE) {
    let body = req.body;
    let url = urlStart + 'api/v1/support/request/new';
    return request.post({url: url, body: body, json: true, jar: true }).pipe(res);
  }
  else {
    return res.json({
      valid: true,
      account: { email: '' },
      secret: ''
    });
  }
}

export function locations(req, res) {
  if (DEV_MODE) { return request(urlStart + 'api/v1/location/list/premium').pipe(res); }
  else { res.json({}); }
}

export function world(req, res) {
  if (DEV_MODE) { return request(urlStart + 'api/v1/location/world').pipe(res); }
  else {
    let world = {
      region: {
        NA: 'North America',
        SA: 'Central & South America',
        CR: 'Caribbean',
        OP: 'Oceania & Pacific',
        EU: 'Europe',
        ME: 'Middle East',
        AF: 'Africa',
        AS: 'Asia & India Subcontinent',
        DEV: 'Development'
      },
      regionOrder: [
        'DEV',
        'NA',
        'SA',
        'CR',
        'EU',
        'ME',
        'AF',
        'AS',
        'OP'
      ],
      country: { US: 'United States' }
    };
    return res.json(world);
  }
}

export function pricingPlans(req, res) {
  let code = req.params.referralCode;
  if (code === 'test') {
    return res.json({
      monthly: {
        price: '11.95',
        paypalPlanId: '',
        bitpayPlanId: '',
      },
      semiannually: {
        price: '42.00',
        paypalPlanId: '',
        bitpayPlanId: '',
      },
      annually: {
        price: '69.00',
        paypalPlanId: 'referralCode',
        bitpayPlanId: '',
      }
    });
  }
  else if (DEV_MODE) {
    let body = {
      monthly: {
        price: '11.95',
        paypalPlanId: 'UKHCGA2VESR5A',
        bitpayPlanId: 'm11KRs736FeBMFoMeoSllMbhydqlxA3KrtlO8usqz+WGoLd0HymdBiKlc0x4/1QienTfpxnDWUJLo2RbLWXWYuVb2fIPUK1HC2gn83bhLGRqE2aWA08OdoVxsASvSGDYevME/GaR8eStmb5PjDh/HdO90HFIKtFtGlu+W3z8WNsZje9AA4miSYljc34DY0bfVRc+Vigws0t47TBvc3TsxqAJ8RVubr5BfyN48xl7aEGvnFGuH/+B3qVftQ3V77DBMp6krLSH3uElSNc0TPkcEULF8tEFM+Ql9CUg/DJ1nBvcKDOK+G2goavLUy55u24fqoS4RuFE46v45KMWLbo5QGR9wSyOFQoHUqKI5FuCHrlBdWTZQiHqUdpa2vrQFafY',
      },
      semiannually: {
        price: '42.00',
        paypalPlanId: 'VW88YD42G7P2L',
        bitpayPlanId: 'm11KRs736FeBMFoMeoSllMbhydqlxA3KrtlO8usqz+WGoLd0HymdBiKlc0x4/1QiCSdoP9NUTcX3Q+kPsB43Na1VYJ/Bb+VL3c0dkglQUUn/dEBNG+hcmActW+edqE2XoF/0p3kv5NA0riDFtwyyW6LUhA0H07Kb6XeecGIwuHq47Evwi+2uUrQtYI9Ig6J6MBP6kKdQX4KTk8xDWHAwjtmgHzw5fmgpVRXNDNbQwSQ43fQlmbhqn9m9C3ZgncoSfc4jnYOFjJldktQFxmTKsYuoPr7drRkluBqDSTkgbTwwmcrGDft+XrRkJUGf3htp1cFGln5pFS4BYb1dxcMhhi23ZdkKtK+visf++Y84Xsiik8slJ584P+zqW1JZt/+c',
      },
      annually: {
        price: '69.00',
        paypalPlanId: 'KY8G9YVQJQYHS',
        bitpayPlanId: 'm11KRs736FeBMFoMeoSllMbhydqlxA3KrtlO8usqz+WGoLd0HymdBiKlc0x4/1QiyO/0ITRZgRbsNe5mvEeDsng+MWd6NzyPtJCGP88yvqXIke/rJvfbJRwLUI8iOrvqlJOZ2O6W/kVEpIGwP2TuGVpka1dcr3i0m+5R5KiQE0nwSqKLDdaBAJQ2nX4+0ty6SH6n2LOdztwkH3sKOEhDXYLfCkmIbyrpZii5WWmSpkH+IFHFhakVIdeJNhkM+ZILdXimQVtVu3W6rNvkqSS0G73KzJwhMFfmemPQpONuf8+eSgrXtdKfK5z7cu8Tm9zqcoz6G5CbBIVXnAvEjjHqhDB/XGMseAfKaGAD8REV2YCVjXzVVOTTJyMm5PZYC8tx',
      }
    };

    return res.json(body);
  }
  else {
    let body = {
      monthly: {
        price: '11.95',
        paypalPlanId: '',
        bitpayPlanId: '',
      },
      semiannually: {
        price: '42.00',
        paypalPlanId: '',
        bitpayPlanId: '',
      },
      annually: {
        price: '69.00',
        paypalPlanId: '',
        bitpayPlanId: '',
      }
    };

    return res.json(body);
  }
}

export function billing(req, res) {
  if (DEV_MODE) {
    let body = req.body;
    let url = urlStart + 'api/v1/billing/receipts';
    return request.get({url: url, json: true, jar: true }).pipe(res);
  }
  else {
    return res.json({ receipts: [] });
  }
}

export function invite(req, res) {
  if (DEV_MODE) {
    let body = req.body;
    let url = urlStart + 'api/v1/account/regiser/teaserShare';
    return request.post({url: url, body: body, json: true, jar: true }).pipe(res);
  }
  else { return res.json({}); }
}

export function recover(req, res) {
  if (DEV_MODE) {
    let body = req.body;
    let url = urlStart + 'api/v1/account/recover/email';
    return request.post({url: url, body: body, json: true, jar: true }).pipe(res);
  }
  else { return res.json({}); }
}

export function reset(req, res) {
  if (DEV_MODE) {
    let body = req.body;
    let url = urlStart + 'api/v1/account/recover/reset';
    return request.post({url: url, body: body, json: true, jar: true }).pipe(res);
  }
  else { return res.json({}); }
}
