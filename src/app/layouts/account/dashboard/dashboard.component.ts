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
    this.authGuard.canActivate(route, state);
  }

  hidePriceBoxes() {
    let renewal = this.user.subscription.renewal;
    let type = this.user.account.type;

    let renewalValid = false;
    let typeValid = false;

    if (renewal === 'annually' || renewal === 'forever') { renewalValid = true; }
    if (type === 'premium') { typeValid = true; }

    if (renewalValid && typeValid) { return true; }
    else { return false; }
  }

  upgrade(planId) {
    this.plansService.selectPlan(planId);
    this.router.navigate(['/account/upgrade']);
  }
}
