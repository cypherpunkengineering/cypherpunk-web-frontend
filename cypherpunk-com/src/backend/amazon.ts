// Our API for demos only
import * as request from 'request';

const DEV_MODE = process.env.DEV_MODE || false;
const REAL_MODE = false;

let urlStart = 'http://localhost:8080/';
if (REAL_MODE) { urlStart = 'https://cypherpunk.privacy.network/'; }

export function amazonPurchase(req, res) {

  if (DEV_MODE) {
    let body = req.body;
    let url = urlStart + 'api/v1/account/purchase/amazon';
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

export function amazonUpgrade(req, res) {
  if (DEV_MODE) {
    let body = req.body;
    let url = urlStart + 'api/v1/account/upgrade/amazon';
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
