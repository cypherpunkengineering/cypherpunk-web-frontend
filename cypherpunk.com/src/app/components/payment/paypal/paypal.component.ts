import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html'
})
export class PaypalComponent {
  @Input() userId: string;

  posData: string;

  constructor() { }

  pay(planId) {
    this.posData = this.userId + '|' + planId;

    setTimeout(() => {
      if (planId.startsWith('monthly')) {
        document.getElementById('paypalMonthly').click();
      }
      else if (planId.startsWith('annually')) {
        document.getElementById('paypalAnnual').click();
      }
      else if (planId.startsWith('semiannually')) {
        document.getElementById('paypalSemiannual').click();
      }
    });
  }
}