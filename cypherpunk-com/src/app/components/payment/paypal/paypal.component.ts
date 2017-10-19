import { Component, Input, OnDestroy } from '@angular/core';
import { PlansService } from '../../../services/plans.service';
import { GlobalsService } from '../../../services/globals.service';

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html'
})
export class PaypalComponent implements OnDestroy {
  env = 'DEV';
  formAction = 'https://www.paypal.com/cgi-bin/webscr';
  formEncrypted = '';
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

  checkout(params: { action: string, encrypted: string }) {
    this.formAction = params.action;
    this.formEncrypted = params.encrypted;
    setTimeout(() => {
      (<HTMLFormElement>document.getElementById('paypalForm')).submit();
    });
  }

  ngOnDestroy() { this.planSubscriber.unsubscribe(); }
}
