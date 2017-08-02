import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { AuthGuard } from '../../../services/auth-guard.service';
import { Component, PLATFORM_ID, Inject, AfterViewInit, NgZone } from '@angular/core';

@Component({
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements AfterViewInit {
  password = '';
  confirm = '';
  error = { message: '' };
  resetButtonDisabled = false;

  constructor(
    private zone: NgZone,
    private router: Router,
    private seo: SeoService,
    private authGuard: AuthGuard,
    private activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    seo.updateMeta({
      title: 'Reset Your Password',
      description: ' ',
      url: '/account/reset'
    });

    // check user account
    if (isPlatformBrowser(this.platformId)) {
      let route = activatedRoute.snapshot;
      let state = router.routerState.snapshot;
      this.authGuard.canActivate(route, state);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) { document.getElementById('password').focus(); }
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
