import { Component, Input, OnDestroy } from '@angular/core';
import { PlansService } from '../../../services/plans.service';
import { GlobalsService } from '../../../services/globals.service';

@Component({
  selector: 'app-bitpay',
  templateUrl: './bitpay.component.html'
})
export class BitpayComponent implements OnDestroy {
  env = 'DEV';
  posData = '';
  monthlyData = '';
  annuallyData = '';
  semiannuallyData = '';
  planSubscriber;

  constructor(private plansService: PlansService, private globals: GlobalsService) {
    this.planSubscriber = plansService.getObservablePlans().subscribe((plans) => {
      this.update();
    });
  }

  update() {
    if (this.globals.ENV === 'PROD' || this.globals.ENV === 'STAGING') { this.env = 'PROD'; }
    if (this.plansService.plans.length) {
      this.monthlyData = this.plansService.plans[0].bitpayData;
      this.annuallyData = this.plansService.plans[1].bitpayData;
      this.semiannuallyData = this.plansService.plans[2].bitpayData;
    }
  }

  pay(userId, plandId, referralCode) {
    let data = { id: userId, plan: plandId, referralCode: referralCode };
    if (!data.referralCode) { delete data.referralCode; }
    this.posData = JSON.stringify(data);

    setTimeout(() => {
      if (plandId.startsWith('monthly')) {
        document.getElementById('bitpayMonthly').click();
      }
      else if (plandId.startsWith('annually')) {
        document.getElementById('bitpayAnnual').click();
      }
      else if (plandId.startsWith('semiannually')) {
        document.getElementById('bitpaySemiannual').click();
      }
    });
  }

  ngOnDestroy() { this.planSubscriber.unsubscribe(); }
}
