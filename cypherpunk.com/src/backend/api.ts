// Our API for demos only
import * as request from 'request';

const DEV_MODE = process.env.DEV_MODE || false;
const REAL_MODE = false;

let urlStart = 'http://localhost:8080/';
if (REAL_MODE) { urlStart = 'https://cypherpunk.privacy.network/'; }

export function subs(req, res) {
  if (DEV_MODE) {
    let url = urlStart + 'api/v0/account/status';
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
    let url =  urlStart + 'api/v0/account/identify/email';
    return request.post({url: url, body: body, json: true, jar: true }).pipe(res);
  }
  else { return res.sendStatus(401); }
}

export function signup(req, res) {
  if (DEV_MODE) {
    let body = req.body;
    let url = urlStart + 'api/v0/account/confirm/email';
    return request.post({url: url, body: body, json: true, jar: true }).pipe(res);
  }
  else {
    return res.json({
      account: { email: req.body.email },
      secret: req.body.password
    });
  }
}

export function confirm(req, res) {
  if (DEV_MODE) {
    let body = req.body;
    let url = urlStart + 'api/v0/account/confirm/email';
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
    let url = urlStart + 'api/v0/account/authenticate/userpasswd';
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
    let url = urlStart + 'api/v0/account/logout';
    return request.post({url: url, body: body, json: true, jar: true }).pipe(res);
  }
  else {
    return res.json({});
  }
}

export function networkStatus(req, res) {
  if (DEV_MODE) { return request(urlStart + 'api/v0/network/status').pipe(res); }
  else { return res.json({ ip: '127.0.0.1', country: 'ZZ'}); }
}

export function blog(req, res) {
  if (DEV_MODE) {
    return request(urlStart + 'api/v0/blog/posts', (err, resp, body) => {
      let retval = JSON.parse(body);
      return res.json(retval);
    });
  }
  else { res.json({}); }
}

export function blogPost(req, res) {
  if (DEV_MODE) {
    let postId = req.params.postId;
    if (postId === 'test') {
      return res.json({
        id: 'test',
        title: '__BLOG_TITLE__',
        content: '__BLOG_CONTENT__',
        published: '__BLOG_DATE__',
        images: [ { url: '' } ]
      });
    }
    else {
      return request(urlStart + 'api/v0/blog/post/' + postId, (err, resp, body) => {
        let retval = JSON.parse(body);
        return res.json(retval);
      });
    }
  }
  else { res.json({}); }
}

export function locations(req, res) {
  if (DEV_MODE) { return request(urlStart + 'api/v0/location/list/premium').pipe(res); }
  else { res.json({}); }
}

export function world(req, res) {
  if (DEV_MODE) { return request(urlStart + 'api/v0/location/world').pipe(res); }
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
