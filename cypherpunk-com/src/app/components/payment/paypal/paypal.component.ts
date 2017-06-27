import { Component, Input, OnChanges } from '@angular/core';
import { GlobalsService } from '../../../services/globals.service';

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html'
})
export class PaypalComponent implements OnChanges {
  @Input() planData;

  env = 'DEV';
  posData = '';
  monthlyButtonId = '';
  annuallyButtonId = '';
  semiannuallyButtonId = '';

  constructor(private globals: GlobalsService) { }

  ngOnChanges() { this.update(); }

  update() {
    if (this.globals.ENV === 'PROD' || this.globals.ENV === 'STAGING') { this.env = 'PROD'; }
    if (this.planData.plans.length) {
      this.monthlyButtonId = this.planData.plans[0].paypalButtonId;
      this.annuallyButtonId = this.planData.plans[1].paypalButtonId;
      this.semiannuallyButtonId = this.planData.plans[2].paypalButtonId;
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
}
