import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private session: SessionService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let url: string = state.url;

    if (url.startsWith('/account/upgrade') || url.startsWith('/user/upgrade')) {
      if (this.auth.authed) { return Promise.resolve(true); }
      return this.checkLogin(url, route);
    }

    if (url.startsWith('/account')) {
      return this.session.pullPlanData()
      .then((valid) => {
        if (valid) { return true; }
        else {
          this.auth.redirectUrl = url;
          this.router.navigate(['/login']);
          return false;
        }
      });
    }

    // non user route protected?
    this.router.navigate(['/login']);
    return Promise.resolve(false);
  }

  checkLogin(url: string, route: ActivatedRouteSnapshot): Promise<boolean> {
    // Case 1: Enter with email and secret
    let email = route.queryParams['user'];
    let secret = route.queryParams['secret'];
    if (email && secret) {
      return this.session.pullPlanData(email, secret)
      .then((valid) => {
        if (valid) { return true; }
        else {
          this.auth.redirectUrl = url;
          this.router.navigate(['/login']);
          return false;
        }
      });
    }
    else {
      return this.session.pullPlanData()
      .then((valid) => {
        if (valid) { return true; }
        else {
          this.auth.redirectUrl = url;
          this.router.navigate(['/login']);
          return false;
        }
      });
    }
  }
}
