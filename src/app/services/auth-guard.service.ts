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

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.checkLogin(url, route);
  }

  checkLogin(url: string, route: ActivatedRouteSnapshot): boolean {
    if (this.auth.authed) { return true; }

    let routePath = route.url.join('/');
    let email = route.queryParams['user'];
    let secret = route.queryParams['secret'];
    if (routePath === 'user/upgrade' && email && secret) {
      this.session.user.email = email;
      this.session.user.secret = secret;
      this.session.pullSessionData();
      return true;
    }

    this.auth.redirectUrl = url;
    this.router.navigate(['/login']);
    return false;
  }
}
