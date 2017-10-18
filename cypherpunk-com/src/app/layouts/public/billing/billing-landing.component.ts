import { Router, ActivatedRoute } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { AuthService } from '../../../services/auth.service';
import { isPlatformBrowser, Location } from '@angular/common';
import { AlertService } from '../../../services/alert.service';
import { AuthGuard } from '../../../services/auth-guard.service';
import { GlobalsService } from '../../../services/globals.service';
import { SessionService } from '../../../services/session.service';
import { BackendService } from '../../../services/backend.service';
import { PlansService, Plan } from '../../../services/plans.service';
import { Component, PLATFORM_ID, Inject, NgZone, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  templateUrl: './billing-landing.component.html',
  styleUrls: ['./billing-landing.component.css']
})
export class BillingLandingComponent implements AfterViewInit, OnDestroy {

  mode: string;
  provider: string;

  redirectTimer;

  constructor(
    private zone: NgZone,
    private router: Router,
    private seo: SeoService,
    private auth: AuthService,
    private location: Location,
    private authGuard: AuthGuard,
    private route: ActivatedRoute,
    private globals: GlobalsService,
    private backend: BackendService,
    private session: SessionService,
    private alertService: AlertService,
    private plansService: PlansService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    let { url, params, queryParams, parent } = this.route.snapshot;

    this.provider = params.provider;
    this.mode = parent.url[parent.url.length - 1].path;
  }

  ngAfterViewInit() {
    if (this.mode === 'complete') {
      this.redirectTimer = setTimeout(() => {
        this.redirectTimer = null;
        this.router.navigate(['/account']);
      }, 5000);
    } else if (this.mode === 'cancel') {
      this.redirectTimer = setTimeout(() => {
        this.redirectTimer = null;
        this.router.navigate(['/billing']);
      }, 5000);
    }
  }

  ngOnDestroy() {
    if (this.redirectTimer) { clearTimeout(this.redirectTimer); }
  }
}
