import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
  authed: boolean = false;
  redirectUrl: string;
  private loginUrl: string = '/account/authenticate/userpasswd';

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
        email: data.acct.email,
        secret: data.secret
      });
    })
    // turn authed on
    .then(() => { this.authed = true; });
  }

  logout() {
    // clear session data and secret
    this.session.clearUserData();
    this.session.clearPlanData();
    // turn off authed
    this.authed = false;
    // cookie remains
  }
}
