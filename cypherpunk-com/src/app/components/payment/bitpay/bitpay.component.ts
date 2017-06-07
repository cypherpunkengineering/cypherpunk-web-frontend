import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bitpay',
  templateUrl: './bitpay.component.html'
})
export class BitpayComponent {
  @Input() userId: string;

  posData = '';

  pay(planId) {
    let data = { id: this.userId, plan: planId };
    this.posData = JSON.stringify(data);

    setTimeout(() => {
      if (planId.startsWith('monthly')) {
        document.getElementById('bitpayMonthly').click();
      }
      else if (planId.startsWith('annually')) {
        document.getElementById('bitpayAnnual').click();
      }
      else if (planId.startsWith('semiannually')) {
        document.getElementById('bitpaySemiannual').click();
      }
    });
  }
}
