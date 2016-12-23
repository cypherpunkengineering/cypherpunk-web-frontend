import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, RequestOptions, Response } from '@angular/http';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';

@Injectable()
export class ConfirmGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private session: SessionService,
    private router: Router,
    private http: Http
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    let accountId = route.queryParams['accountId'];
    let confToken = route.queryParams['confirmationToken'];

    return this.checkToken(accountId, confToken)
    .then((data) => {
      // set user session data
      this.session.setUserData({
        account: { email: data['account']['email'] },
        secret: data['secret']
      });
      // turn auth on
      this.auth.authed = true;
    })
    .catch((err) => { this.router.navigate(['/']); });
  }

  checkToken(accountId: string, confToken: string): Promise<any> {
    let url = `/api/v0/account/confirm/email`;
    let body = { accountId: accountId, confirmationToken: confToken };
    let options = new RequestOptions({});

    // this will set cookie
    return this.http.post(url, body, options).toPromise()
    .then((res: Response) => {
      if (res.status === 200) {
        let retVal = res.json() || {};
        return retVal;
      }
      else { return Promise.reject('Failed Authentication'); }
    });
  }
}
