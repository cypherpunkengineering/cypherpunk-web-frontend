import { Component } from '@angular/core';
import { AuthGuard } from '../../../services/auth-guard.service';
import { SessionService } from '../../../services/session.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PlansService } from '../../../services/plans.service';
import { isBrowser } from 'angular2-universal';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  user: any;
  upgrade: boolean = true;
  loading: boolean = true;
  showEmailModal: boolean = false;
  showPasswordModal: boolean = false;

  constructor(
    private router: Router,
    private authGuard: AuthGuard,
    private session: SessionService,
    private activatedRoute: ActivatedRoute
  ) {
    this.user = this.session.user;

    if (isBrowser) {
      let route = activatedRoute.snapshot;
      let state = router.routerState.snapshot;
      this.authGuard.canActivate(route, state)
      .then((data) => { this.loading = false; })
      .catch(() => { /* keep error from showing up in console */ });
    }
  }

  showPriceBoxes() {
    let type = this.user.account.type;
    let renewal = this.user.subscription.renewal;

    if (type === 'free') { return true; }
    else if (type === 'premium') {
      if (renewal !== 'annually' && renewal !== 'forever') { return true; }
    }
    else { return false; }
  }

  openEmailModal() {
    this.showEmailModal = true;
    setTimeout(() => { document.getElementById('dashboardEmail').focus(); }, 510);
  }

  openPasswordModal() {
    this.showPasswordModal = true;
    setTimeout(() => { document.getElementById('dashboardPassword').focus(); }, 510);
  }
}
