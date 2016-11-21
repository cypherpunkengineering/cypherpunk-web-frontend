import { Injectable, Inject, NgZone } from '@angular/core';
import { Http, Response } from '@angular/http';
import { LocalStorage } from './local-storage';

@Injectable()
export class SessionService {
  user = {
    username: '',
    email: '',
    secret: '',
    status: '',
    type: '',
    period: '',
    renewal: '',
    confirmed: false,
    priceModel: 0,
    payOption: 0
  };

  constructor(
    private http: Http,
    private zone: NgZone,
    @Inject(LocalStorage) private localStorage
  ) {
    this.user.username = localStorage.getItem('username') || '';
    this.user.email = localStorage.getItem('email') || '';
    this.user.secret = localStorage.getItem('secret') || '';
  }

  setUserData(user) {
    this.user.email = user.email;
    this.user.secret = user.secret;
    this.localStorage.setItem('email', user.email);
    this.localStorage.setItem('secret', user.secret);
  }

  pullPlanData(): Promise<boolean> {
    let url = '/api/v0/subscription/status';
    return this.http.get(url).toPromise()
    .then((res: Response) => { return res.json() || {}; })
    .then((data) => {
      this.zone.run(() => {
        this.user.type = data.type;
        this.user.confirmed = data.confirmed;
        if (data.confirmed) { this.user.status = 'active'; }

        // handle user period/renewal
        if (data.renewal === 'none') { this.user.period = 'free'; }
        else { this.user.period = data.renewal; }

        // hanlde renewal/expiration
        let now = new Date();
        let expiration = new Date(data.expiration);
        if (data.expiration === 'none') { this.user.renewal = ''; }
        else if (expiration > now) {
          let period = this.user.period;
          let month = expiration.getMonth() + 1;
          let day = expiration.getDate();
          let year = expiration.getFullYear();
          this.user.renewal = `Renews ${period} on ${month}/${day}/${year}`;
        }
      });
    })
    .then(() => { return true; })
    .catch(() => { return false; });
  }

  clearUserData() {
    this.user.email = '';
    this.user.secret = '';
    this.localStorage.removeItem('email');
    this.localStorage.removeItem('secret');
  }

  clearPlanData() {
    this.user.type = 'free';
    this.user.confirmed = false;
    this.user.renewal = '';
    this.user.period = '';
  }
}
