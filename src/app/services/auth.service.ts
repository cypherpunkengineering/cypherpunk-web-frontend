import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
  authed: boolean = false;
  redirectUrl: string;
  private signinUrl: string = '/api/v0/account/authenticate/userpasswd';
  private signoutUrl: string = '/api/v0/account/logout';

  constructor(
    private session: SessionService,
    private http: Http
  ) { }

  signin(user): Promise<void> {
    let body = { login: user.email, password: user.password };
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    // this will set cookie
    return this.http.post(this.signinUrl, body, options).toPromise()
    .then((res: Response) => { return res.json() || {}; })
    // set user session data
    .then((data) => { this.session.setUserData(data); })
    // turn authed on
    .then(() => { this.authed = true; });
  }

  signout() {
    let body = { };
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.signoutUrl, body, options).toPromise()
    .then((res: Response) => {
      try { return res.json(); } catch (e) { return {}; }
    })
    // clear session
    .then(() => { this.session.clearUserData(); })
    // turn off authed
    .then(() => { this.authed = false; });
  }
}
