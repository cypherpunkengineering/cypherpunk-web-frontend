import { Injectable, NgZone } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class SessionService {
  user = {
    username: '',
    email: '',
    secret: '',
    status: 'active',
    type: 'free',
    period: '6 months',
    renewalDate: '1970-01-01T00:00:00Z',
    daysLeft: 0,
    confirmed: false,
    priceModel: 0,
    payOption: 0
  };

  constructor(private http: Http, private zone: NgZone) {
    this.user.username = localStorage.getItem('username') || 'tester';
    this.user.email = localStorage.getItem('email') || 'test@example.com';
    this.user.secret = localStorage.getItem('secret') || '';
  }

  setUserData(user) {
    this.user.email = user.email;
    this.user.secret = user.secret;
    localStorage.setItem('email', user.email);
    localStorage.setItem('secret', user.secret);
  }

  pullPlanData() {
    let url = '/api/subscription/status';
    return this.http.get(url).toPromise()
    .then((res: Response) => { return res.json() || {}; })
    .then((data) => {
      this.zone.run(() => {
        this.user.type = data.type;
        this.user.confirmed = data.confirmed;
        this.user.renewalDate = data.expiration;
        this.user.period = data.renewal;

        let now = new Date();
        let renewalDate = new Date(this.user.renewalDate);
        let oneDay = 24 * 60 * 60 * 1000;
        this.user.daysLeft = Math.round(now.getTime() - renewalDate.getTime() / (oneDay));
      });
    });
  }

  clearUserData() {
    this.user.email = '';
    this.user.secret = '';
    localStorage.removeItem('email');
    localStorage.removeItem('secret');
  }

  clearPlanData() {
    this.user.type = 'free';
    this.user.confirmed = false;
    this.user.renewalDate = Date.now().toString();
    this.user.period = 'none';
  }
}
