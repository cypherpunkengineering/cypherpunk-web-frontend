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

    if (url.startsWith('/account/upgrade')) {
      if (this.auth.authed) { return Promise.resolve(true); }
      let email = route.queryParams['user'];
      let secret = route.queryParams['secret'];
      return this.checkLogin(url, route, email, secret);
    }

    if (url.startsWith('/account/billing')) {
      if (this.auth.authed) { return Promise.resolve(true); }
      return this.checkLogin(url, route);
    }

    if (url.startsWith('/account')) {
      return this.checkLogin(url, route);
    }

    // non user route protected?
    this.router.navigate(['/login']);
    return Promise.resolve(false);
  }

  checkLogin(url: string, route: ActivatedRouteSnapshot, email?: string, secret?: string): Promise<boolean> {
    let promise;
    if (email && secret) { promise = this.session.pullPlanData(email, secret); }
    else { promise = this.session.pullPlanData(); }

    return promise
    .then((valid) => {
      if (valid) {
        this.auth.authed = true;
        return true;
      }
      else {
        this.auth.authed = false;
        this.session.userFound = false;
        this.auth.redirectUrl = url;
        this.router.navigate(['/login']);
        return false;
      }
    });
  }
}
