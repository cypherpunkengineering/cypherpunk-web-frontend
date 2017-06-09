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

  setPlanVisibility (planCode, userType): void {
    if (userType === 'free') {
      this.plans.map((plan) => { plan.viewable = true; });
    }
    else if (planCode === 'monthly') {
      this.plans[0].viewable = false;
      this.plans[1].viewable = true;
      this.plans[2].viewable = true;
    }
    else if (planCode === 'semiannually') {
      this.plans[0].viewable = false;
      this.plans[1].viewable = true;
      this.plans[2].viewable = false;
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
