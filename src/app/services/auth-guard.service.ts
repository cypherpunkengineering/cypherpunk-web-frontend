import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { scraping } from './scraping';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private session: SessionService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (scraping) { return true; }

    let url: string = state.url;

    return this.checkLogin(url, route);
  }

  checkLogin(url: string, route: ActivatedRouteSnapshot): boolean {
    // Case 1: Already authed
    if (this.auth.authed) { return true; }

    // Case 2: Enter with email and secret
    let routePath = route.url.join('/');
    let email = route.queryParams['user'];
    let secret = route.queryParams['secret'];
    if (routePath === 'user/upgrade' && email && secret) {
      this.session.setUserData({ email: email, secret: secret });
      this.session.pullPlanData(); // need secret integration
      return true;
    }

    // Case 3: not authed, redirect to login
    this.auth.redirectUrl = url;
    this.router.navigate(['/login']);
    return false;
  }
}
