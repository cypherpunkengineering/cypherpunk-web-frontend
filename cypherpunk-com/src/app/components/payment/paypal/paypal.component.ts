import { Component, Input, OnDestroy } from '@angular/core';
import { PlansService } from '../../../services/plans.service';
import { GlobalsService } from '../../../services/globals.service';

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html'
})
export class PaypalComponent implements OnDestroy {
  env = 'DEV';
  posData = '';
  monthlyButtonId = '';
  annuallyButtonId = '';
  semiannuallyButtonId = '';
  planSubscriber;
  
  constructor(private plansService: PlansService, private globals: GlobalsService) {
    this.planSubscriber = plansService.getObservablePlans().subscribe((plans) => {
      this.update();
    });
  }

  update() {
    if (this.globals.ENV === 'PROD' || this.globals.ENV === 'STAGING') { this.env = 'PROD'; }
    if (this.plansService.plans.length) {
      this.monthlyButtonId = this.plansService.plans[0].paypalButtonId;
      this.annuallyButtonId = this.plansService.plans[1].paypalButtonId;
      this.semiannuallyButtonId = this.plansService.plans[2].paypalButtonId;
    }
  }

  pay(userId, planDuration, referralCode) {
    let data = { id: userId, plan: planDuration, referralCode: referralCode };
    if (!data.referralCode) { delete data.referralCode; }
    this.posData = JSON.stringify(data);

    setTimeout(() => {
      if (planDuration.startsWith('monthly')) {
        if (this.env === 'DEV') { document.getElementById('paypalDevMonthly').click(); }
        else { document.getElementById('paypalMonthly').click(); }
      }
      else if (planDuration.startsWith('annually')) {
        if (this.env === 'DEV') { document.getElementById('paypalDevAnnual').click(); }
        else { document.getElementById('paypalAnnual').click(); }
      }
      else if (planDuration.startsWith('semiannually')) {
        if (this.env === 'DEV') { document.getElementById('paypalDevSemiannual').click(); }
        else { document.getElementById('paypalSemiannual').click(); }
      }
    });
  }

  ngOnDestroy() { this.planSubscriber.unsubscribe(); }
}
