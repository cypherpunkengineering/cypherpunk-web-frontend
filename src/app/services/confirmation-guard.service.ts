import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Response } from '@angular/http';
import { AuthService } from './auth.service';

@Injectable()
export class ConfirmationGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router, private http: Http) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let accountId = route.params['accountId'];
    let confToken = route.queryParams['confirmationToken'];

    return this.checkToken(accountId, confToken)
    .then(function(valid) {
      if (valid) {
        this.auth.authed = true;
        return true;
      }
      else {
        this.router.navigate(['/']);
        return false;
      }
    });
  }

  checkToken(accountId: string, confToken: string): Promise<boolean> {
    let url = `https://cypherpunk.engineering/account/confirm/${accountId}?confirmationToken=${confToken}`;
    return this.http.get(url).toPromise()
    .then(function(res: Response) {
      if (res.status === 200) { return true; }
      else { return false; }
    })
    .catch(function() { return false; });
  }
}
