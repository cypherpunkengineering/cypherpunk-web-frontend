import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

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
      return this.checkAuth(url, route, secret);
    }
    else if (url.startsWith('/account/billing')) {
      if (this.auth.authed) { return Promise.resolve({}); }
      return this.checkAuth(url, route);
    }
    else if (url.startsWith('/account/setup')) {
      if (this.auth.authed) { return Promise.resolve({}); }
      return this.checkAuth(url, route);
    }
    else if (url.startsWith('/account')) {
      let secret = route.queryParams['secret'];
      return this.checkAuth(url, route, secret);
    }
    else {
      // non user route protected?
      this.router.navigate(['/login']);
      return Promise.resolve({});
    }
  }

  checkAuth(url: string, route: ActivatedRouteSnapshot, secret?: string): Promise<any> {
    return this.session.pullPlanData(secret)
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
        return Promise.reject({}); // kill any extra code from executing after this level
      }
    });
  }

  shouldUpgrade(): Promise<any> {
    return this.session.pullPlanData()
    .then((data) => {
      if (data.authed) {
        this.auth.authed = true;
        return data;
      }
      else {
        this.auth.authed = false;
        this.session.userFound = false;
        return Promise.reject({});
      }
    });
  }
}
