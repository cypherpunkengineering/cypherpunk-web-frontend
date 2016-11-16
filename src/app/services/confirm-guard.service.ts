import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Response } from '@angular/http';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { scraping } from './scraping';

@Injectable()
export class ConfirmGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private session: SessionService,
    private router: Router,
    private http: Http
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (scraping) { return Promise.resolve(true); }

    let accountId = route.queryParams['accountId'];
    let confToken = route.queryParams['confirmationToken'];

    return this.checkToken(accountId, confToken)
    .then((data) => {
      let valid = data['valid'];

      if (valid) {
        // set user session data
        this.session.setUserData({
          email: data['account']['email'],
          secret: data['secret']
        });
        // turn auth on
        this.auth.authed = true;
        return true;
      }
      else {
        this.router.navigate(['/']);
        return false;
      }
    });
  }

  checkToken(accountId: string, confToken: string): Promise<Object> {
    let url = `/api/v0/account/confirm/${accountId}?confirmationToken=${confToken}`;
    let retVal = { valid: false };

    // this will set cookie
    return this.http.get(url).toPromise()
    .then((res: Response) => {
      if (res.status === 200) { retVal.valid = true; }
      return res;
    })
    .then((res: Response) => {
      retVal = res.json() || {};
      retVal.valid = true;
      return retVal;
    })
    .catch(() => { return retVal; });
  }
}
