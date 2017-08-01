import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { AuthGuard } from '../../../services/auth-guard.service';
import { SessionService } from '../../../services/session.service';
import { BackendService } from '../../../services/backend.service';
import { GlobalsService } from '../../../services/globals.service';
import { Component, PLATFORM_ID, Inject, NgZone } from '@angular/core';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  env: string;
  currentTab = '';
  intervalCounter = 0;
  intervalHandler: any;
  showGettingStarted: boolean;
  testLoading: boolean;
  confirmed: boolean;
  emailUpdated: boolean;

  // current site state
  state: {
    user: any,
    loading: boolean,
    showPPWarning: boolean,
    showBPWarning: boolean
  } = {
    user: {},
    loading: true,
    showPPWarning: false,
    showBPWarning: false
  };

  constructor(
    private zone: NgZone,
    private router: Router,
    private authGuard: AuthGuard,
    private backend: BackendService,
    private session: SessionService,
    private globals: GlobalsService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // handle title
    this.document.title = 'My Account with Cypherpunk Privacy';

    // set env and user
    this.env = this.globals.ENV;
    this.state.user = this.session.user;

    // detect Getting Started
    this.showGettingStarted = (this.state.user.account.type !== 'free') && this.session.getGettingStarted();

    // detect incoming from paypal
    let tx = this.activatedRoute.snapshot.queryParamMap['params']['tx'];
    let st = this.activatedRoute.snapshot.queryParamMap['params']['st'];
    let testLoading = this.activatedRoute.snapshot.queryParamMap['params']['loading'];
    if (tx && st === 'Completed') { this.state.showPPWarning = true; }
    if (testLoading) { this.testLoading = true; }

    // handle incoming from bitpay
    if (isPlatformBrowser(this.platformId)) {
      let ref = document.referrer;
      let prodBitpay = ref.startsWith('https://bitpay.com');
      let testBitpay = ref.startsWith('https://test.bitpay.com');
      if (prodBitpay || testBitpay) { this.state.showBPWarning = true; }
    }

    // handle confirmed in query params
    if (this.activatedRoute.snapshot.queryParamMap['confirmed']) { this.confirmed = true; }

    // handle email updated
    if (this.activatedRoute.snapshot.queryParamMap['emailupdated']) { this.emailUpdated = true; }

    // handle page routing
    let page = this.activatedRoute.snapshot.params['page'];
    if (page === 'subscription') { this.currentTab = page; }
    else if (page === 'billing') { this.currentTab = page; }
    else if (page === 'refer') { this.currentTab = page; }
    else if (page === 'dns') { this.currentTab = page; }
    else if (page === 'issue') { this.currentTab = page; }
    else if (page === 'configs') { this.currentTab = page; }
    else { this.currentTab = 'overview'; }

    // redirect user if not logged in
    if (isPlatformBrowser(this.platformId)) {
      let route = this.activatedRoute.snapshot;
      let state = this.router.routerState.snapshot;
      this.authGuard.canActivate(route, state)
      .then((data) => {
        this.zone.run(() => {
          if (this.state.showPPWarning && this.state.user.account.type === 'free') {
            this.intervalHandler = setInterval(() => { this.pollStatus(); }, 5000);
          }
          else if (testLoading) { /* keep loading page up */ }
          else { this.state.loading = false; }

          if (data.account.type === 'pending' || data.account.type === 'invitation') {
            let error = 'You\'ve been placed on the waitlist. Due to high popularity, we are out of Free Preview Access accounts. Your invitation request has been placed on our waitlist. We will notify you once your request is approved.';
            if (this.confirmed) {
              error = 'Your account is now confirmed<br><br>' + error;
              this.confirmed = false;
            }
            if (this.emailUpdated) {
              error = 'Your email was successfully updated<br><br>' + error;
              this.emailUpdated = false;
            }
            this.alertService.success(error);
          }
          else if (!data.account.confirmed) {
            let error = 'Your account is not confirmed! Please check your email and click on the link to confirm your account.';
            this.alertService.warning(error);
          }

          this.session.setUserData(data);
        });
      })
      .catch(() => { /* keep error from showing up in console */ });
    }
  }

  pollStatus() {
    this.intervalCounter++;
    this.backend.accountStatus()
    .then((data) => {
      if (data.account.type === 'premium') {
        this.session.setUserData(data);
        this.showGettingStarted = true;
        this.state.loading = false;
        clearInterval(this.intervalHandler);
      }
      if (this.intervalCounter > 5) {
        this.state.loading = false;
        clearInterval(this.intervalHandler);
      }
    });
  }

  changePage(page) {
    this.currentTab = page;
    this.router.navigate(['/account/' + page]);
  }

  hideGettingStarted() {
    this.zone.run(() => {
      this.session.setGettingStarted(false);
      this.showGettingStarted = false;
    });
  }

  showConfig() {
    let type = this.session.user.account.type;
    if (type === 'invitation' || type === 'pending' || type === 'expired') { return false; }
    else { return true; }
  }
}
