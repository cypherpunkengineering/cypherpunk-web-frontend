import { Component } from '@angular/core';
import { AuthGuard } from '../../../services/auth-guard.service';
import { SessionService } from '../../../services/session.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PlansService } from '../../../services/plans.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  user: any;
  loading: boolean = true;
  showEmailModal: boolean = false;
  showPasswordModal: boolean = false;

  // payment plans
  plans = this.plansService.plans;
  selectPlan = this.plansService.selectPlan;
  selectedPlan = this.plansService.selectedPlan;

  constructor(
    private router: Router,
    private authGuard: AuthGuard,
    private session: SessionService,
    private plansService: PlansService,
    private activatedRoute: ActivatedRoute
  ) {
    this.user = this.session.user;

    let route = activatedRoute.snapshot;
    let state = router.routerState.snapshot;
    this.authGuard.canActivate(route, state)
    .then((data) => { this.loading = data.loading || false; });
  }

  hidePriceBoxes() {
    let type = this.user.account.type;
    let renewal = this.user.subscription.renewal;

    if (type === 'free') { return false; }
    else if (type === 'premium' && renewal !== 'annually') { return false; }
    return true;
  }

  upgrade(id) {
    this.selectPlan(id);
    this.router.navigate(['/account/upgrade']);
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
