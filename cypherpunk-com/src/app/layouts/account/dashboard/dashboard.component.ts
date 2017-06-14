import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { AuthGuard } from '../../../services/auth-guard.service';
import { SessionService } from '../../../services/session.service';
import { BackendService } from '../../../services/backend.service';
import { Component, PLATFORM_ID, Inject, NgZone, OnInit } from '@angular/core';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentTab = '';
  intervalCounter = 0;
  intervalHandler: any;
  showGettingStarted: boolean;

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
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // handle title
    this.document.title = 'My Account with Cypherpunk Privacy';

    // set user
    this.state.user = this.session.user;
    this.showGettingStarted = (this.session.user.account.type === 'premium') && this.session.getGettingStarted();

    // redirect user if not logged in
    if (isPlatformBrowser(this.platformId)) {
      let route = activatedRoute.snapshot;
      let state = router.routerState.snapshot;
      this.authGuard.canActivate(route, state)
      .then((data) => {
        this.zone.run(() => {
          if (!this.state.showPPWarning) { this.state.loading = false; }
          if (!data.account.confirmed) {
            alertService.warning('Your account is not confirmed! Please check your email and click on the link to confirm your account.');
          }
        });
      })
      .catch(() => { /* keep error from showing up in console */ });
    }
  }

  ngOnInit() {
    // handle incoming from paypal
    this.activatedRoute.queryParams.subscribe((qParams) => {
      let tx = qParams['tx'];
      let st = qParams['st'];
      if (!tx || st !== 'Completed') { return; }
      if (tx && st === 'Completed') { this.state.showPPWarning = true; }

      if (this.state.showPPWarning && this.state.user.account.type === 'free') {
        this.state.loading = true;
        this.intervalHandler = setInterval(() => {
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
        }, 5000);
      }
    });

    // handle incoming from bitpay
    if (isPlatformBrowser(this.platformId)) {
      let ref = document.referrer;
      if (ref.startsWith('https://bitpay.com') || ref.startsWith('https://test.bitpay.com')) {
        this.state.showBPWarning = true;
      }
    }

    // handle page routing
    let page = this.activatedRoute.snapshot.params['page'];
    if (page === 'subscription') { this.currentTab = page; }
    else if (page === 'billing') { this.currentTab = page; }
    else if (page === 'refer') { this.currentTab = page; }
    else if (page === 'dns') { this.currentTab = page; }
    else if (page === 'configs') { this.currentTab = page; }
    else { this.currentTab = 'overview'; }
  }

  changePage(page) { this.currentTab = page; }

  hideGettingStarted() {
    this.session.setGettingStarted(false);
    this.showGettingStarted = false;
  }
}
