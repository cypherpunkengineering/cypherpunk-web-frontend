import { Injectable, NgZone } from '@angular/core';

export class Plan {
  id: string;
  price: number;
  bcPrice: number;
  rate: string;
  months: number;
  viewable: boolean;
  bitpayData: string;
  paypalButtonId: string;

  constructor(id, price, rate, months, viewable, bitpayData, paypalButtonId) {
    this.id = id;
    this.price = price;
    this.bcPrice = undefined;
    this.rate = rate;
    this.months = months;
    this.viewable = viewable;
    this.bitpayData = bitpayData;
    this.paypalButtonId = paypalButtonId;
  }
}

@Injectable()
export class PlansService {
  plans: Plan[] = []
  selectedPlanId: string;

  constructor(private zone: NgZone) { }

  setPlanVisibility(planCode, userType, renews): void {
    if (userType === 'free' || userType === 'expired' || !renews) {
      this.plans.map((plan) => { plan.viewable = true; });
    }
    else if (planCode === 'monthly') {
      if (this.plans[0]) { this.plans[0].viewable = false; }
      if (this.plans[1]) { this.plans[1].viewable = true; }
      if (this.plans[2]) { this.plans[2].viewable = true; }
    }
    else if (planCode === 'semiannually') {
      if (this.plans[0]) { this.plans[0].viewable = false; }
      if (this.plans[1]) { this.plans[1].viewable = true; }
      if (this.plans[2]) { this.plans[2].viewable = false; }
    }
    else if (planCode === 'annually') {
      this.plans.map((plan) => { plan.viewable = false; });
    }
    else if (planCode === 'forever') {
      this.plans.map((plan) => { plan.viewable = false; });
    }
    else {
      this.plans.map((plan) => { plan.viewable = true; });
    }
  }
}
