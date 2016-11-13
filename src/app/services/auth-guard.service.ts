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

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (scraping) { return Promise.resolve(true); }

    let url: string = state.url;

    if (url === '/user') {
      return this.session.pullPlanData()
      .then((valid) => {
        if (valid) { return true; }
        else { this.router.navigate(['/login']); }
      });
    }

    return this.checkLogin(url, route);
  }

  checkLogin(url: string, route: ActivatedRouteSnapshot): Promise<boolean> {
    // Case 1: Already authed
    if (this.auth.authed) { return Promise.resolve(true); }

    // Case 2: Enter with email and secret
    let routePath = route.url.join('/');
    let email = route.queryParams['user'];
    let secret = route.queryParams['secret'];
    if (routePath === 'user/upgrade' && email && secret) {
      this.session.setUserData({ email: email, secret: secret });
      this.session.pullPlanData(); // need secret integration
      return Promise.resolve(true);
    }

    // Case 3: not authed, redirect to login
    this.auth.redirectUrl = url;
    this.router.navigate(['/login']);
    return Promise.resolve(false);
  }
}
