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
    type: 'free',
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
    localStorage.setItem('email', user.email);
    localStorage.setItem('secret', user.secret);
  }

  pullPlanData() {
    let url = '/api/v0/subscription/status';
    return this.http.get(url).toPromise()
    .then((res: Response) => { return res.json() || {}; })
    .then((data) => {
      this.zone.run(() => {
        this.user.type = data.type;
        this.user.confirmed = data.confirmed;
        this.user.status = 'active';

        // handle user period/renewal
        if (data.renewal === 'none') { this.user.period = 'free account'; }
        else { this.user.period = data.renewal; }

        // hanlde renewal/expiration
        let now = new Date();
        let expiration = new Date(data.expiration);
        if (data.expiration === 'none') { this.user.renewal = ''; }
        else if (expiration > now) {
          let oneDay = 24 * 60 * 60 * 1000;
          let daysLeft = Math.round((expiration.getTime() - now.getTime()) / (oneDay));
          let month = expiration.getMonth() + 1;
          let day = expiration.getDate();
          let year = expiration.getFullYear();
          this.user.renewal = `Renews on ${month}/${day}/${year}, ${daysLeft} days left`;
        }
        else { this.user.renewal = 'Expired'; }
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
    this.user.renewal = '';
    this.user.period = '';
  }
}
