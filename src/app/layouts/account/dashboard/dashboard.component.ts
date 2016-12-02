import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../../services/session.service';
import { Plan, PlansService } from '../../../services/plans.service';

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
    private session: SessionService,
    private plansService: PlansService
  ) {
    this.user = session.user;
    this.plans = plansService.plans;
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
