import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class ConfirmationGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let token = route.params['token'];
    let valid = this.checkToken(token);

    if (valid) {
      this.auth.authed = true;
      return true;
    }
    else { this.router.navigate(['/login']); }
  }

  checkToken(token: string): boolean {
    if (token === 'confirmationToken') { return true; }
    else { return false; }
  }
}
