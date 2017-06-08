// Our API for demos only
import * as request from 'request';

const DEV_MODE = process.env.DEV_MODE || false;
const REAL_MODE = false;

let urlStart = 'http://localhost:8080/';
if (REAL_MODE) { urlStart = 'https://cypherpunk.privacy.network/'; }

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
    let url = urlStart + 'api/v1/zendesk/request/new';
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
  let code = req.body.referralCode;
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
        paypalPlanId: '',
        bitpayPlanId: '',
      }
    });
  }
  else if (DEV_MODE) {
    let body = req.body;
    let url = urlStart + 'api/v1/pricing/plans';
    return request.post({url: url, body: body, json: true, jar: true }).pipe(res);
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
