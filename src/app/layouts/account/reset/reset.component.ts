import { isBrowser } from 'angular2-universal';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthGuard } from '../../../services/auth-guard.service';
import { Component, AfterViewInit, NgZone } from '@angular/core';

@Component({
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements AfterViewInit {
  password: string = '';
  confirm: string = '';
  error = { message: '' };
  resetButtonDisabled: boolean = false;

  constructor(
    private zone: NgZone,
    private router: Router,
    private authGuard: AuthGuard,
    private activatedRoute: ActivatedRoute
  ) {
    if (isBrowser) {
      let route = activatedRoute.snapshot;
      let state = router.routerState.snapshot;
      this.authGuard.canActivate(route, state);
    }
  }

  ngAfterViewInit() {
    if (isBrowser) {
      document.getElementById('password').focus();
    }
  }

  validateReset () {
    if (!this.password.length) { return false; }
    if (!this.confirm.length) { return false; }
    if (this.password !== this.confirm) { return false; }
    return true;
  }

  comparePass() {
    let error = '';
    if (this.password !== this.confirm) {
      error = 'Password and Confirmation do not match';
    }

    this.error.message = error;
  }

  reset() {
    this.resetButtonDisabled = true;
    // call server here
  }
}
