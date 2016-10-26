import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
  authed: boolean = false;
  redirectUrl: string;

  constructor(
    private session: SessionService,
    private http: Http
  ) {}

  login(user): Promise<void> {
    let session = this.session;
    let authed = this.authed;

    let url = '/account/authenticate/userpasswd';
    let body = { login: user.login, password: user.password};
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, body, options).toPromise()
    .then(function(res: Response) {
      console.log(res);
      return res.json();
    })
    .then(function(data) {
      console.log(data);
      session.user.email = data.acct.email;
      session.user.secret = data.secret;
      authed = true;
    });
  }

  logout() {
    // clear session data and secret
    this.authed = false;
  }
}
