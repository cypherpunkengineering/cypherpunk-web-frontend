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
      id: 'monthly899',
      price: 8.99,
      period: '1 Month',
      total: 8.99,
      yearly: '$ 8.99 billed monthly',
      selected: false
    },
    {
      id: 'annually5999',
      price: 4.99,
      period: '12 Months',
      total: 59.99,
      yearly: '$ 59.99 billed annually',
      selected: true
    },
    {
      id: 'semiannually4499',
      price: 7.49,
      period: '6 Months',
      total: 44.99,
      yearly: '$ 44.99 billed semiannually',
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
