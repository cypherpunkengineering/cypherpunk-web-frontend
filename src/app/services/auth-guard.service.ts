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

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    let url: string = state.url;

    if (url.startsWith('/account/upgrade')) {
      if (this.auth.authed) { return Promise.resolve({}); }
      let secret = route.queryParams['secret'];
      return this.checkLogin(url, route, secret);
    }
    else if (url.startsWith('/account/billing')) {
      if (this.auth.authed) { return Promise.resolve({}); }
      return this.checkLogin(url, route);
    }
    else if (url.startsWith('/account/setup')) {
      if (this.auth.authed) { return Promise.resolve({}); }
      return this.checkLogin(url, route);
    }
    else if (url.startsWith('/account')) {
      let secret = route.queryParams['secret'];
      return this.checkLogin(url, route, secret);
    }
    else {
      // non user route protected?
      this.router.navigate(['/login']);
      return Promise.resolve({});
    }
  }

  checkLogin(url: string, route: ActivatedRouteSnapshot, secret?: string): Promise<any> {
    let promise;
    if (secret) { promise = this.session.pullPlanData(secret); }
    else { promise = this.session.pullPlanData(); }

    return promise
    .then((data) => {
      if (data.authed) {
        this.auth.authed = true;
        return data;
      }
      else {
        this.auth.authed = false;
        this.session.userFound = false;
        this.auth.redirectUrl = url;
        this.router.navigate(['/login']);
        return Promise.reject({});
      }
    });
  }
}
