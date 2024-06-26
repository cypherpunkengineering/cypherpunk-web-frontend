import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { BackendService } from './backend.service';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class ConfirmChangeGuard implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthService,
    private session: SessionService,
    private backend: BackendService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    let accountId = route.queryParams['accountId'];
    let confToken = route.queryParams['confirmationToken'];
    let body = { accountId: accountId, confirmationToken: confToken };

    // this will set cookie
    return this.backend.confirmChangeToken(body, {})
    .then((data) => {
      // set user session data
      this.session.setUserData({
        account: { email: data['account']['email'] },
        secret: data['secret']
      });
      // turn auth on
      this.auth.authed = true;
    })
    .catch(() => { this.router.navigate(['/']); });
  }
}
