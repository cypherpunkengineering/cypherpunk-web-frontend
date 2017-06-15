import { Component, Input, ViewChild } from '@angular/core';
import { BackendService } from '../../../../../services/backend.service';
import { PlansService, Plan } from '../../../../../services/plans.service';

@Component({
  selector: 'account-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class AccountOverviewComponent {
  @ViewChild('priceBoxes') priceBoxes;
  @Input() state;

  upgrade = true;
  showEmailModal = false;
  showPasswordModal = false;
  planData: {
    plans: Plan[],
    selected: Plan,
    referralCode: string
  } = {
    plans: [],
    selected: undefined,
    referralCode: ''
  };

  constructor(private backend: BackendService) {
    // Determine plans to show
    this.backend.pricingPlans('', {})
    .then((plans) => {
      // monthly plan
      this.planData.plans.push({
        id: 'monthly',
        price: Number(plans.monthly.price),
        bcPrice: undefined,
        rate: 'monthly plan',
        months: 1,
        viewable: true,
        bitpayData: plans.monthly.bitpayPlanId,
        paypalButtonId: plans.monthly.paypalPlanId
      });
      // annual plan
      this.planData.plans.push({
        id: 'annually',
        price: Number(plans.annually.price),
        bcPrice: undefined,
        rate: '12 month plan',
        months: 12,
        viewable: true,
        bitpayData: plans.annually.bitpayPlanId,
        paypalButtonId: plans.annually.paypalPlanId
      });
      // semiannual plan
      this.planData.plans.push({
        id: 'semiannually',
        price: Number(plans.semiannually.price),
        bcPrice: undefined,
        rate: '6 month plan',
        months: 6,
        viewable: true,
        bitpayData: plans.semiannually.bitpayPlanId,
        paypalButtonId: plans.semiannually.paypalPlanId
      });
      this.planData.selected = this.planData.plans[1];
      if (this.priceBoxes) { this.priceBoxes.updatePlans(); }
    })
    .catch((err) => {
      console.log('Could not pull pricing plans, defaulting');
      console.log(err);
    });
  }

  showPriceBoxes() {
    let type = this.state.user.account.type;
    let renewal = this.state.user.subscription.renewal;

    if (type === 'free') { return true; }
    else if (type === 'premium') {
      if (renewal !== 'annually' && renewal !== 'forever') { return true;
      }
    }
    else { return false; }
  }

  openEmailModal() {
    this.showEmailModal = true;
    setTimeout(() => { document.getElementById('dashboardEmail').focus(); }, 510);
  }

  openPasswordModal() {
    this.showPasswordModal = true;
    setTimeout(() => { document.getElementById('dashboardPassword').focus(); }, 510);
  }
}