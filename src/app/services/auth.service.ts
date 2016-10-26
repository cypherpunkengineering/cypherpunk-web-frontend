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
      this.session.user.email = data.acct.email;
      this.session.user.secret = data.secret;
      this.authed = true;
    });
  }

  logout() {
    // clear session data and secret
    this.authed = false;
  }
}
