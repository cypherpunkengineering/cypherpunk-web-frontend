import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
  authed: boolean = false;
  redirectUrl: string;
  private loginUrl: string = '/api/v0/account/authenticate/userpasswd';
  private logoutUrl: string = '/api/v1/account/logout';

  constructor(
    private session: SessionService,
    private http: Http
  ) { }

  login(user): Promise<void> {
    let body = { login: user.login, password: user.password };
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    // this will set cookie
    return this.http.post(this.loginUrl, body, options).toPromise()
    .then((res: Response) => { return res.json() || {}; })
    // set user session data
    .then((data) => {
      this.session.setUserData({
        email: data.account.email,
        secret: data.secret
      });
    })
    // turn authed on
    .then(() => { this.authed = true; });
  }

  logout() {
    let body = { };
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.logoutUrl, body, options).toPromise()
    .then((res: Response) => { return res.json() || {}; })
    // clear session data and secret
    .then((data) => {
      this.session.clearUserData();
      this.session.clearPlanData();
    })
    // turn off authed
    .then(() => { this.authed = false; });
  }
}
