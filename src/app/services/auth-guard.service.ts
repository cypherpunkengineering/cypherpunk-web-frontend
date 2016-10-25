import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.checkLogin(url, route);
  }

  checkLogin(url: string, route: ActivatedRouteSnapshot): boolean {
    return true;
	/*
    if (this.auth.authed) { return true; }

    let user = route.queryParams['user'];
    let secret = route.queryParams['secret'];
    if (user && secret) { return true; }

    this.auth.redirectUrl = url;
    this.router.navigate(['/login']);
    return false;
	*/
  }
}
