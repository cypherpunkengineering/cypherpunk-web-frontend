import { Injectable, NgZone } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class SessionService {
  user = {
    username: '',
    email: 'test@example.com',
    status: 'active',
    type: 'free',
    period: '6 months',
    renewalDate: '2017-03-03T03:24:00',
    confirmed: false,
    priceModel: 0,
    payOption: 0,
    secret: ''
  };

  constructor(private http: Http, private zone: NgZone) {
    this.user.username = localStorage.getItem('username') || 'tester';
    this.user.email = localStorage.getItem('email') || 'test@example.com';
    this.user.secret = localStorage.getItem('secret') || '';
  }

  pullSessionData() {
    let url = '/api/subscription/status';
    return this.http.get(url).toPromise()
    .then((res: Response) => { return res.json() || {}; })
    .then((data) => {
      this.zone.run(() => {
        this.user.type = data.type;
        this.user.confirmed = data.confirmed;
        this.user.renewalDate = data.expiration;
        this.user.period = data.renewal.toUpperCase();
      });
    });
  }
}
