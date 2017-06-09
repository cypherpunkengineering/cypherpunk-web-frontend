import { Component, Input, OnChanges } from '@angular/core';
import { GlobalsService } from '../../../services/globals.service';

@Component({
  selector: 'app-bitpay',
  templateUrl: './bitpay.component.html'
})
export class BitpayComponent implements OnChanges {
  @Input() user;
  @Input() planData;

  env = 'DEV';
  posData = '';
  monthlyData = '';
  annuallyData = '';
  semiannuallyData = '';

  constructor(private globals: GlobalsService) { }

  ngOnChanges() { this.update(); }

  update() {
    if (this.globals.ENV === 'PROD') { this.env = 'PROD'; }
    if (this.planData.plans.length) {
      this.monthlyData = this.planData.plans[0].bitpayData;
      this.annuallyData = this.planData.plans[1].bitpayData;
      this.semiannuallyData = this.planData.plans[2].bitpayData;
    }
  }

  pay(planDuration, referralCode) {
    let data = { id: this.user.account.id, plan: planDuration, referralCode: referralCode };
    console.log(data);
    if (!data.referralCode) { delete data.referralCode; }
    this.posData = JSON.stringify(data);

    setTimeout(() => {
      if (planDuration.startsWith('monthly')) {
        document.getElementById('bitpayMonthly').click();
      }
      else if (planDuration.startsWith('annually')) {
        document.getElementById('bitpayAnnual').click();
      }
      else if (planDuration.startsWith('semiannually')) {
        document.getElementById('bitpaySemiannual').click();
      }
    });
  }
}
