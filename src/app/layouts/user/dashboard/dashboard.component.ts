import { Component } from '@angular/core';
import { SessionService } from '../../../services/session.service';
import { Plan, PlansService } from '../../../services/plans.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  user: any;

  plans: Plan[] = this.plansService.plans;
  selectPlan = this.plansService.selectPlan;

  showEmailModal: boolean = false;
  showPasswordModal: boolean = false;

  constructor(private session: SessionService, private plansService: PlansService) {
    session.pullPlanData();
    this.user = session.user;
  }

}
