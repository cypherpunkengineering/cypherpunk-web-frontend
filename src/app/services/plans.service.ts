import { Injectable } from '@angular/core';

export class Plan {
  id: string;
  price: number;
  period: string;
  total: number;
  yearly: string;
  selected: boolean;
  constructor() {}
}

@Injectable()
export class PlansService {
  plans: Plan[] = [
    {
      id: 'monthly999',
      price: 9.99,
      period: '1 Month',
      total: 9.99,
      yearly: '$ 9.99 billed monthly',
      selected: false
    },
    {
      id: 'annually8004',
      price: 6.25,
      period: '12 Months',
      total: 80.04,
      yearly: '$ 80.04 billed annually',
      selected: true
    },
    {
      id: 'semiannually4998',
      price: 8.33,
      period: '6 Months',
      total: 49.98,
      yearly: '$ 49.98 billed semiannually',
      selected: false
    }
  ];
  selectedPlan: Plan = this.plans[1];

  selectPlan(id: string): void {
    this.plans.map((plan) => {
      if (plan.id === id) {
        plan.selected = true;
        this.selectedPlan = plan;
      }
      else { plan.selected = false; }
    });
  }
}
