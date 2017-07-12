import 'rxjs/add/operator/toPromise';
import { Inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { GlobalsService } from './globals.service';
import { Http, RequestOptions, Response } from '@angular/http';

@Injectable()
export class BackendService {
  private errString = 'Bad Response from server';

  constructor(private http: Http, private globals: GlobalsService) { }

  // User authentication

  confirmToken(body, options): Promise<any> {
    // this will set cookie
    let url = this.globals.API_URL + '/account/confirm/email';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson);
  }

  confirmChangeToken(body, options): Promise<any> {
    // this will set cookie
    let url = this.globals.API_URL + '/account/confirm/emailChange';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson);
  }

  signin(body, options): Promise<any> {
    // this will set cookie
    let url = this.globals.API_URL + '/account/authenticate/userpasswd';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  accountStatus(secret?: string): Promise<any> {
    let url = this.globals.API_URL + '/account/status';
    let options = new RequestOptions({ withCredentials: true });
    if (secret) { url = url + '?secret=' + secret; }
    return this.http.get(url, options).toPromise()
    .then(this.parseJson);
  }

  signout(body, options): Promise<any> {
    let url = this.globals.API_URL + '/account/logout';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then((res: Response) => {
      try { return res.json(); }
      catch (e) { return {}; }
    });
  }

  signup(body, options): Promise<any> {
    // this will set cookie
    let url = this.globals.API_URL + '/account/register/signup';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  changeEmail(body, options): Promise<any> {
    // this will set cookie
    let url = this.globals.API_URL + '/account/change/email';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  changePassword(body, options): Promise<any> {
    // this will set cookie
    let url = this.globals.API_URL + '/account/change/password';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  invite(body, options): Promise<any> {
    let url = this.globals.API_URL + '/account/register/teaserShare';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }


  // User account apis

  pricingPlans(referralCode, options): Promise<any> {
    let url = this.globals.API_URL + '/pricing/plans';
    if (referralCode) { url += '/' + referralCode; }
    return this.http.get(url, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  cards() {
    let url = this.globals.API_URL + '/account/source/list';
    let options = new RequestOptions({ withCredentials: true });
    return this.http.get(url, options)
    .map(res => res.json());
  }

  createCard(body, options): Promise<any> {
    // set cookie
    let url = this.globals.API_URL + '/account/source/add';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  defaultCard(body, options): Promise<any> {
    let url = this.globals.API_URL + '/account/source/default';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  stripeCharge(body, options): Promise<any> {
    // sets cookie
    let url = this.globals.API_URL + '/account/purchase/stripe';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  stripeUpgrade(body, options): Promise<any> {
    // set cookie
    let url = this.globals.API_URL + '/account/upgrade/stripe';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  amazonCharge(body, options): Promise<any> {
    // sets cookie
    let url = this.globals.API_URL + '/account/purchase/amazon';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  amazonUpgrade(body, options): Promise<any> {
    let url = this.globals.API_URL + '/account/upgrade/amazon';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  createAccount(body, options): Promise<any> {
    // sets cookie
    let url = this.globals.API_URL + '/account/register/signup';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  identifyEmail(body, options): Promise<any> {
    let url = this.globals.API_URL + '/account/identify/email';
    return this.http.post(url, body, options).toPromise();
  }

  billingReceipts(options): Promise<any> {
    let url = this.globals.API_URL + '/billing/receipts';
    options.withCredentials = true;
    return this.http.get(url, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  blogPosts() {
    let url = this.globals.API_URL + '/blog/posts';
    return this.http.get(url)
    .map(res => res.json());
  }

  blogPost(postId) {
    let url = this.globals.API_URL + '/blog/post/' + postId;
    return this.http.get(url)
    .map(res => res.json());
  }

  supportPosts() {
    let url = this.globals.API_URL + '/support/posts';
    return this.http.get(url).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  supportPost(id) {
    let url = this.globals.API_URL + '/support/post/' + id;
    return this.http.get(url).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  contactForm(body) {
    let url = this.globals.API_URL + '/support/request/new';
    return this.http.post(url, body).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  // public apis

  networkStatus() {
    let url = this.globals.API_URL + '/network/status';
    return this.http.get(url)
    .map(res => res.json());
  }

  locations() {
    let url = this.globals.API_URL + '/location/list/premium';
    return this.http.get(url)
    .map(res => res.json());
  }

  regions() {
    let url = this.globals.API_URL + '/location/world';
    return this.http.get(url)
    .map(res => res.json());
  }

  // helper functions

  parseJson(res: Response): Promise<any> {
    if (!res['_body']) { return; } // handle empty status 200 return
    try { return res.json(); }
    catch (e) {
      let error = 'Bad Response from server - ' + res;
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
