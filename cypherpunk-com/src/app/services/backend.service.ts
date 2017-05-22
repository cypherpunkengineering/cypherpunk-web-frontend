import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Http, RequestOptions, Response } from '@angular/http';

@Injectable()
export class BackendService {
  private backend = 'http://localhost:3000';
  private backendUrl = '/api/v0/';
  private errString = 'Bad Response from server';

  constructor(
    private http: Http,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // live
    if (isPlatformBrowser(platformId) && !document.location.hostname.startsWith('localhost')) {
      this.backend = 'https://cypherpunk.privacy.network';
      this.backendUrl = this.backend + '/api/v0/';
    }
    // dev
    else {
      this.backend = 'http://localhost:3000';
      this.backendUrl = this.backend + '/api/v0/';
    }
  }

  // User authentication

  confirmToken(body, options): Promise<any> {
    // this will set cookie
    let url = this.backendUrl + 'account/confirm/email';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson);
  }

  signin(body, options): Promise<any> {
    // this will set cookie
    let url = this.backendUrl + 'account/authenticate/userpasswd';
    options.withCredentials = true;
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

  signup(body, options): Promise<any> {
    // this will set cookie
    let url = this.backendUrl + 'account/register/signup';
    options.withCredentials = true;
    return this.http.post(url, body, options).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
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
    let url = this.backend + '/api/v1/blog/posts';
    return this.http.get(url)
    .map(res => res.json());
  }

  blogPost(postId) {
    let url = this.backend + '/api/v1/blog/post/' + postId;
    return this.http.get(url)
    .map(res => res.json());
  }

  supportPosts() {
    let url = this.backend + '/api/v1/support/posts';
    return this.http.get(url).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  supportPost(id) {
    let url = this.backend + '/api/v1/support/post/' + id;
    return this.http.get(url).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
  }

  contactForm(body) {
    let url = this.backend + '/api/v1/zendesk/request/new';
    return this.http.post(url, body).toPromise()
    .then(this.parseJson)
    .catch(this.catchFunction);
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
