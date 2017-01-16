// Our API for demos only
import * as request from 'request';

const DEV_MODE = process.env.DEV_MODE || false;

export function subs(req, res) {
  let body = {
    secret: '',
    privacy: {
      username: '',
      password: ''
    },
    account: {
      id: '1',
      email: '',
      type: 'free',
      confirmed: false
    },
    subscription: {
      renewal: '',
      expiration: '0'
    }
  };

  return res.json(body);
  // return res.sendStatus(401);
}

export function stripePurchase(req, res) {
  let body = {
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
  };
  return res.json(body);
}

export function amazonPurchase(req, res) {
  let body = {
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
  };
  return res.json(body);
}

export function identify(req, res) {
  let valid = false;
  if (valid) { return res.sendStatus(200); }
  else { return res.sendStatus(401); }
}

export function signup(req, res) {
  return res.json({
    account: { email: req.body.email },
    secret: req.body.password
  });
}

export function confirm(req, res) {
  let body = {
    valid: true,
    account: { email: '' },
    secret: ''
  };
  return res.json(body);
}

export function signin(req, res) {
  let body = {
    secret: 'abcd',
    privacy: { username: '', password: '' },
    account: { id: 'id', email: '', confirmed: true, type: '' },
    subscription: { renewal: 'forever', expiration: '0' }
  };
  return res.json(body);
}

export function signout(req, res) {
  return res.json({});
}

export function networkStatus(req, res) {
  if (DEV_MODE) { return request('http://localhost:8080/api/v0/network/status').pipe(res); }
  else { return res.json({ ip: '127.0.0.1', country: 'ZZ'}); }
}

export function blog(req, res) {
  if (DEV_MODE) { return request('http://localhost:8080/api/v0/blog/posts').pipe(res); }
  else { res.json({}); }
}

export function locations(req, res) {
  if (DEV_MODE) { return request('http://localhost:8080/api/v0/location/list/premium').pipe(res); }
  else { res.json({}); }
}

export function world(req, res) {
  if (DEV_MODE) { return request('http://localhost:8080/api/v0/location/world').pipe(res); }
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
