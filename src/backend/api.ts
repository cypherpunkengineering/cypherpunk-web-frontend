// Our API for demos only
import {fakeDataBase} from './db';
import {fakeDemoRedisCache} from './cache';

// you would use cookies/token etc
var USER_ID = 'f9d98cf1-1b96-464e-8755-bcc2a5c09077'; // hardcoded as an example

// Our API for demos only
export function serverApi(req, res) {
  let key = USER_ID + '/data.json';
  let cache = fakeDemoRedisCache.get(key);
  if (cache !== undefined) {
    console.log('/data.json Cache Hit');
    return res.json(cache);
  }
  console.log('/data.json Cache Miss');

  fakeDataBase.get()
    .then(data => {
      fakeDemoRedisCache.set(key, data);
      return data;
    })
    .then(data => res.json(data));
}

export function subs(req, res) {
  let body = {};

  if (req.query.secret) {
    body = {
      secret: 'secret',
      privacy: {
        username: 'test',
        password: 'test'
      },
      account: {
        id: '1',
        email: 'test@test.test',
        type: 'premium',
        confirmed: false
      },
      subscription: {
        renewal: 'forever',
        expiration: '0'
      }
    };
  }
  else {
    body = {
      secret: 'secret',
      privacy: {
        username: 'test',
        password: 'test'
      },
      account: {
        id: '1',
        email: 'test@test.test',
        type: 'free',
        confirmed: false
      },
      subscription: {
        renewal: 'forever',
        expiration: '0'
      }
    };
  }

  return res.json(body);
}

export function confirm(req, res) {
  let body = {
    valid: true,
    account: { email: '' },
    secret: ''
  };
  return res.json(body);
}

export function login(req, res) {
  let body = {
    secret: 'abcd',
    privacy: { username: 'username', password: 'password' },
    account: { id: 'id', email: 'test@test.test', confirmed: true, type: 'premium' },
    subscription: { renewal: 'forever', expiration: '0' }
  };
  return res.json(body);
}

export function logout(req, res) {
  return res.json({});
}
