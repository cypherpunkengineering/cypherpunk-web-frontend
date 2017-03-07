import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { BackendService } from './backend.service';
import { Headers, RequestOptions } from '@angular/http';

@Injectable()
export class AuthService {
  authed: boolean = false;
  redirectUrl: string;

  constructor(
    private session: SessionService,
    private backend: BackendService
  ) { }

  signup(user): Promise<void> {
    let body = { login: user.email, password: user.password };
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    // this will set cookie
    return this.backend.signup(body, options)
    // set user session data
    .then((data) => { this.session.setUserData(data); })
    // turn authed on
    .then(() => { this.authed = true; });
  }

  signin(user): Promise<void> {
    let body = { login: user.email, password: user.password };
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    // this will set cookie
    return this.backend.signin(body, options)
    // set user session data
    .then((data) => { this.session.setUserData(data); })
    // turn authed on
    .then(() => { this.authed = true; });
  }

  signout() {
    let body = { };
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    return this.backend.signout(body, options)
    // clear session
    .then(() => { this.session.clearUserData(); })
    // turn off authed
    .then(() => { this.authed = false; });
  }
}
