import { Injectable, Inject, NgZone } from '@angular/core';
import { Http, Response } from '@angular/http';
import { PlansService } from './plans.service';
import { LocalStorage } from './local-storage';

@Injectable()
export class SessionService {
  user = {
    privacy: { username: '', password: '' },
    account: { id: '', email: '', confirmed: false, type: '' },
    subscription: { renewal: '', expiration: '', expirationString: '' },
    secret: '',
    status: '',
    priceModel: 0,
    payOption: 0
  };

  constructor(
    private http: Http,
    private zone: NgZone,
    private plans: PlansService,
    @Inject(LocalStorage) private localStorage
  ) {
    this.user.privacy.username = localStorage.getItem('privacy.username') || '';
    this.user.privacy.password = localStorage.getItem('privacy.password') || '';
    this.user.account.id = localStorage.getItem('account.id') || '';
    this.user.account.email = localStorage.getItem('account.email') || '';
    this.user.account.confirmed = Boolean(localStorage.getItem('account.confirmed')) || false;
    this.user.account.type = localStorage.getItem('account.type') || '';
    this.user.subscription.renewal = localStorage.getItem('subscription.renewal') || '';
    this.user.subscription.expiration = localStorage.getItem('subscription.expiration') || '';
    this.user.secret = localStorage.getItem('secret') || '';
    this.user.status = localStorage.getItem('status') || '';
    plans.setPlanVisibility(this.user.subscription.renewal);
    this.setExpirationString(this.user.subscription.expiration);
  }

  setExpirationString(expiration) {
    // handle expiration
    let now = new Date();
    let expirationDate = new Date(expiration);
    if (expirationDate > now) {
      let renewal = this.user.subscription.renewal;
      let month = expiration.getMonth() + 1;
      let day = expiration.getDate();
      let year = expiration.getFullYear();
      this.user.subscription.expirationString = `Renews ${renewal} on ${month}/${day}/${year}`;
    }
    else { this.user.subscription.expirationString = ''; }
  }

  setUserData(user) {
    if (!user) { return; }

    if (user.privacy) {
      let username = user.privacy.username;
      let password = user.privacy.password;

      if (username) {
        this.user.privacy.username = username;
        this.localStorage.setItem('privacy.username', username);
      }

      if (password) {
        this.user.privacy.password = password;
        this.localStorage.setItem('privacy.password', password);
      }
    }

    if (user.account) {
      let id = user.account.id;
      let email = user.account.email;
      let confirmed = user.account.confirmed;
      let type = user.account.type;

      if (id) {
        this.user.account.id = id;
        this.localStorage.setItem('account.id', id);
      }

      if (email) {
        this.user.account.email = email;
        this.localStorage.setItem('account.email', email);
      }

      if (confirmed) {
        this.user.account.confirmed = confirmed;
        this.localStorage.setItem('account.confirmed', confirmed);
      }

      if (type) {
        this.user.account.type = type;
        this.localStorage.setItem('account.type', type);
      }
    }

    if (user.subscription) {
      let renewal = user.subscription.renewal;
      let expiration = user.subscription.expiration;

      if (renewal) {
        this.user.subscription.renewal = renewal;
        this.localStorage.setItem('subscription.renewal', renewal);
      }

      if (expiration) {
        this.user.subscription.expiration = expiration;
        this.localStorage.setItem('subscription.expiration', expiration);
      }
    }

    if (user.secret) {
      this.user.secret = user.secret;
      this.localStorage.setItem('secret', user.secret);
    }

    if (user.status) {
      this.user.status = user.status;
      this.localStorage.setItem('status', user.status);
    }

    this.plans.setPlanVisibility(this.user.subscription.renewal);
    this.setExpirationString(this.user.subscription);
  }

  pullPlanData(email?: string, secret?: string): Promise<boolean> {
    let url = '';
    if (secret) { url = `/api/v0/subscription/status?secret=${secret}`; }
    else { url = '/api/v0/subscription/status'; }

    return this.http.get(url).toPromise()
    .then((res: Response) => { return res.json() || {}; })
    .then((data) => {
      let user = {
        secret: secret,
        status: '',
        account: { email: email, type: data.type, confirmed: data.confirmed },
        subscription: { renewal: data.renewal, expiration: data.expiration }
      };
      if (data.confirmed) { user.status = 'active'; }
      this.setUserData(user);
      return data;
    })
    .then(() => { return true; })
    .catch(() => { return false; });
  }

  clearUserData() {
    this.user.secret = '';
    this.localStorage.removeItem('secret');

    this.user.status = '';
    this.localStorage.removeItem('status');

    this.user.privacy = { username: '', password: '' };
    this.localStorage.removeItem('privacy.username');
    this.localStorage.removeItem('privacy.password');

    this.user.account = { id: '', email: '', confirmed: false, type: '' };
    this.localStorage.removeItem('account.id');
    this.localStorage.removeItem('account.email');
    this.localStorage.removeItem('account.confirmed');
    this.localStorage.removeItem('account.type');

    this.user.subscription = { renewal: '', expiration: '', expirationString: '' };
    this.localStorage.removeItem('subscription.renewal');
    this.localStorage.removeItem('subscription.expiration');
  }
}
