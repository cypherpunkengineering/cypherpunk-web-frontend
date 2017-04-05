import { Injectable, NgZone } from '@angular/core';

export class Plan {
  id: string;
  price: number;
  bcPrice: number;
  period: string;
  total: number;
  bcTotal: number;
  yearly: string;
  bcYearly: string;
  rate: string;
  months: string;
  viewable: boolean;
  constructor() {}
}

@Injectable()
export class PlansService {
  plans: Plan[] = [
    {
      id: 'monthly1295',
      price: 12.95,
      bcPrice: undefined,
      period: 'Monthly',
      total: 12.95,
      bcTotal: undefined,
      yearly: '12.95',
      bcYearly: '',
      rate: 'monthly plan',
      months: '1',
      viewable: true
    },
    {
      id: 'annually9995',
      price: 8.32,
      bcPrice: undefined,
      period: 'Yearly',
      total: 99.95,
      bcTotal: undefined,
      yearly: '99.95',
      bcYearly: '',
      rate: '12 month plan',
      months: '12',
      viewable: true
    },
    {
      id: 'semiannually5995',
      price: 9.99,
      bcPrice: undefined,
      period: '6 Monthly',
      total: 59.95,
      bcTotal: undefined,
      yearly: '59.95',
      bcYearly: '',
      rate: '6 month plan',
      months: '6',
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
