import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Response } from '@angular/http';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';

@Injectable()
export class ConfirmationGuard implements CanActivate {

  constructor(private auth: AuthService, private session: SessionService, private router: Router, private http: Http) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let accountId = route.params['accountId'];
    let confToken = route.queryParams['confirmationToken'];
    let auth = this.auth;
    let router = this.router;
    let session = this.session;

    return this.checkToken(accountId, confToken)
    .then(function(data) {
      let valid = data['valid'];

      if (valid) {
        auth.authed = true;
        session.user.email = data['acct']['email'];
        session.user.secret = data['secret'];
        localStorage.setItem('email', session.user.email);
        session.pullSessionData();
        return true;
      }
      else {
        router.navigate(['/']);
        return false;
      }
    });
  }

  checkToken(accountId: string, confToken: string): Promise<Object> {
    let url = `/account/confirm/${accountId}?confirmationToken=${confToken}`;
    let retVal = { valid: false };

    return this.http.get(url).toPromise()
    .then(function(res: Response) {
      if (res.status === 200) { retVal.valid = true; }
      return res;
    })
    .then(function(res: Response) {
      retVal = res.json();
      retVal.valid = true;
      return retVal;
    })
    .catch(function() { return retVal; });
  }
}
