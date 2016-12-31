import { Injectable, NgZone } from '@angular/core';

export class Plan {
  id: string;
  price: number;
  period: string;
  total: number;
  yearly: string;
  viewable: boolean;
  constructor() {}
}

@Injectable()
export class PlansService {
  plans: Plan[] = [
    {
      id: 'monthly899',
      price: 8.99,
      period: '1 Month',
      total: 8.99,
      yearly: '$ 8.99 / monthly',
      viewable: true
    },
    {
      id: 'annually5999',
      price: 4.99,
      period: '12 Months',
      total: 59.99,
      yearly: '$ 59.99 / annually',
      viewable: true
    },
    {
      id: 'semiannually4499',
      price: 7.49,
      period: '6 Months',
      total: 44.99,
      yearly: '$ 44.99 / semiannually',
      viewable: true
    }
  ];

  selectedPlan: Plan = this.plans[1];

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
