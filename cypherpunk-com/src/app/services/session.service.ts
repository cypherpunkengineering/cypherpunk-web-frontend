import { PlansService } from './plans.service';
import { BackendService } from './backend.service';
import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID, NgZone } from '@angular/core';

@Injectable()
export class SessionService {
  userFound = false;
  localStorage: any;
  user = {
    privacy: { username: '', password: '' },
    account: { id: '', email: '', confirmed: false, type: '' },
    subscription: { renewal: '', expiration: '', expirationString: '' },
    secret: '',
    status: '',
    priceModel: 0,
    payOption: 0,
    showGettingStarted: false
  };

  constructor(
    private zone: NgZone,
    private plans: PlansService,
    private backend: BackendService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    try {
      if (isPlatformBrowser(this.platformId)) {
        this.localStorage = window.localStorage;
        this.user.privacy.username = this.localStorage.getItem('privacy.username') || '';
        this.user.privacy.password = this.localStorage.getItem('privacy.password') || '';
        this.user.account.id = this.localStorage.getItem('account.id') || '';
        this.user.account.email = this.localStorage.getItem('account.email') || '';
        this.user.account.confirmed = this.localStorage.getItem('account.confirmed') === 'true';
        this.user.account.type = this.localStorage.getItem('account.type') || '';
        this.user.subscription.renewal = this.localStorage.getItem('subscription.renewal') || '';
        this.user.subscription.expiration = this.localStorage.getItem('subscription.expiration') || '';
        this.user.secret = this.localStorage.getItem('secret') || '';
        this.user.status = this.localStorage.getItem('status') || '';
        this.setExpirationString(this.user.subscription.expiration);
        if (this.user.account.email && this.user.secret) { this.userFound = true; }
        this.setSnapEngageEmail(this.user);
      }
    }
    catch (e) {
      this.userFound = false;
      console.log(e);
    };
  }

  setExpirationString(expiration) {
    if (expiration === '0') { this.user.subscription.expirationString = 'Never'; return; }

    let now = new Date();
    let expirationDate = new Date(expiration);
    if (expirationDate > now) {
      let renewal = this.user.subscription.renewal;
      let month = expirationDate.getMonth() + 1;
      let day = expirationDate.getDate();
      let year = expirationDate.getFullYear();
      this.user.subscription.expirationString = `Renews ${renewal} on ${month}/${day}/${year}`;
    }
    else { this.user.subscription.expirationString = ''; }
  }

  setUserData(user) {
    if (!user) { return; }

    if (user.privacy) {
      let username = user.privacy.username || '';
      this.user.privacy.username = username;
      this.localStorage.setItem('privacy.username', username);

      let password = user.privacy.password || '';
      this.user.privacy.password = password;
      this.localStorage.setItem('privacy.password', password);
    }

    if (user.account) {
      let id = user.account.id || '';
      this.user.account.id = id;
      this.localStorage.setItem('account.id', id);

      let email = user.account.email || '';
      this.user.account.email = email;
      this.localStorage.setItem('account.email', email);

      let confirmed = user.account.confirmed || false;
      this.user.account.confirmed = confirmed;
      this.localStorage.setItem('account.confirmed', confirmed);

      let type = user.account.type || '';
      this.user.account.type = type;
      this.localStorage.setItem('account.type', type);
    }

    if (user.subscription) {
      let renewal = user.subscription.renewal || '';
      this.user.subscription.renewal = renewal;
      this.localStorage.setItem('subscription.renewal', renewal);

      let expiration = user.subscription.expiration;
      this.user.subscription.expiration = expiration;
      this.localStorage.setItem('subscription.expiration', expiration);
    }

    this.user.secret = user.secret || '';
    this.localStorage.setItem('secret', this.user.secret);

    this.user.status = user.status || '';
    this.localStorage.setItem('status', this.user.status);

    this.setExpirationString(this.user.subscription.expiration);
  }

  pullPlanData(secret?: string): Promise<any> {
    return this.backend.accountStatus(secret)
    .then((data) => {
      if (data.confirmed) { data.status = 'active'; }
      this.setUserData(data);
      return data;
    })
    .then(this.setSnapEngageEmail)
    .then((data) => {
      data.authed = true;
      return data;
    })
    .catch(() => { return { authed: false }; });
  }

  setSnapEngageEmail(data) {
    (<any>window).SnapEngageEmail = data.account.email;
    let snapEngage = (<any>window).SnapEngage;
    if (snapEngage) { snapEngage.setUserEmail(data.account.email); }
    return data;
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

    this.userFound = false;
  }

  getGettingStarted() {
    if (isPlatformBrowser(this.platformId)) {
      this.localStorage = window.localStorage;
      return this.localStorage.getItem('showGettingStarted') === 'true';
    }
    else { return false; }
  }

  setGettingStarted(enabled: boolean) {
    this.user.showGettingStarted = enabled;
    this.localStorage.setItem('showGettingStarted', enabled);
  }
}
