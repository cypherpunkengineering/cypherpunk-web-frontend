import { Component } from '@angular/core';
import { AuthGuard } from '../../../services/auth-guard.service';
import { SessionService } from '../../../services/session.service';
import { Plan, PlansService } from '../../../services/plans.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  user: any;
  plans: Plan[];
  loading: boolean = true;
  showEmailModal: boolean = false;
  showPasswordModal: boolean = false;

  constructor(
    private router: Router,
    private authGuard: AuthGuard,
    private session: SessionService,
    private plansService: PlansService,
    private activatedRoute: ActivatedRoute
  ) {
    this.user = this.session.user;
    this.plans = this.plansService.plans;

    let route = activatedRoute.snapshot;
    let state = router.routerState.snapshot;
    this.authGuard.canActivate(route, state)
    .then((data) => { this.loading = data || false; });
  }

  hidePriceBoxes() {
    let type = this.user.account.type;
    let renewal = this.user.subscription.renewal;
    if (type === 'free') { return false; }
    else if (type === 'premium' && renewal !== 'annually') { return false; }
    return true;
  }

  upgrade(planId) {
    this.plansService.selectPlan(planId);
    this.router.navigate(['/account/upgrade']);
  }
}
