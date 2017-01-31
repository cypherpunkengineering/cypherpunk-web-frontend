import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { isBrowser } from 'angular2-universal';
import { Http, RequestOptions, Response } from '@angular/http';

@Injectable()
export class BackendService {
  private backendUrl = '/api/v0/';
  private errString: string = 'Bad Response from server';

  constructor(private http: Http) {
    if (isBrowser && !document.location.hostname.startsWith('localhost')) {
      this.backendUrl = 'https://cypherpunk.privacy.network/api/v0/';
    }
  }

  // User authentication

  confirmToken(body, options): Promise<any> {
    // this will set cookie
    let url = this.backendUrl + 'account/confirm/email';
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson);
  }

  signin(body, options): Promise<any> {
    // this will set cookie
    let url = this.backendUrl + 'account/authenticate/userpasswd';
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  accountStatus(secret?: string): Promise<any> {
    let url = this.backendUrl + 'account/status';
    let options = new RequestOptions({ withCredentials: true });
    if (secret) { url = url + '?secret=' + secret; }
    return this.http.get(url, options).toPromise()
    .then(this.parseJson);
  }

  signout(body, options): Promise<any> {
    let url = this.backendUrl + 'account/logout';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then((res: Response) => {
      try { return res.json(); }
      catch (e) { return {}; }
    });
  }

  // User account apis

  cards() {
    let url = this.backendUrl + 'account/source/list';
    let options = new RequestOptions({ withCredentials: true });
    return this.http.get(url, options)
    .map(res => res.json());
  }

  createCard(body, options): Promise<any> {
    // set cookie
    let url = this.backendUrl + 'account/source/add';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  defaultCard(body, options): Promise<any> {
    let url = this.backendUrl + 'account/source/default';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  stripeCharge(body, options): Promise<any> {
    // sets cookie
    let url = this.backendUrl + 'account/purchase/stripe';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  stripeUpgrade(body, options): Promise<any> {
    // set cookie
    let url = this.backendUrl + 'account/upgrade/stripe';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  amazonCharge(body, options): Promise<any> {
    // sets cookie
    let url = this.backendUrl + 'account/purchase/amazon';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  amazonUpgrade(body, options): Promise<any> {
    let url = this.backendUrl + 'account/upgrade/amazon';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  createAccount(body, options): Promise<any> {
    // sets cookie
    let url = this.backendUrl + 'account/register/signup';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  identifyEmail(body, options): Promise<any> {
    let url = this.backendUrl + 'account/identify/email';
    return this.http.post(url, body, options).toPromise();
  }

  blogPosts() {
    let url = this.backendUrl + 'blog/posts';
    return this.http.get(url)
    .map(res => res.json());
  }

  // public apis

  networkStatus() {
    let url = this.backendUrl + 'network/status';
    return this.http.get(url)
    .map(res => res.json());
  }

  locations() {
    let url = this.backendUrl + 'location/list/premium';
    return this.http.get(url)
    .map(res => res.json());
  }

  regions() {
    let url = this.backendUrl + 'location/world';
    return this.http.get(url)
    .map(res => res.json());
  }

  // helper functions

  parseJson(res: Response): Promise<any> {
    try { return res.json(); }
    catch (e) {
      let error = this.errString + ' - ' + res;
      return Promise.reject(error);
    }
  }

  catchFunction(error): Promise<any> {
    try {
      let jsonError = error.json();
      return Promise.reject(jsonError);
    }
    catch (parseError) {
      let retError;
      if (error.status) { retError = { message: error._body }; }
      else { retError = { message: error }; }
      return Promise.reject(retError);
    }
  }
}
